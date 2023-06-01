package generator

import (
	"bytes"
	"fmt"
	"go/format"
	"go/parser"
	"go/token"
	"path"
	"strconv"
	"strings"

	"github.com/fern-api/fern-go/internal/fern/ir"
	"golang.org/x/tools/go/ast/astutil"
)

// fileHeader is the comment included in every generated Go file.
const fileHeader = `// Generated by Fern. Do not edit.

`

// fileWriter wries and formats Go files.
type fileWriter struct {
	filename       string
	packageName    string
	baseImportPath string
	imports        imports
	types          map[ir.TypeId]*ir.TypeDeclaration
	buffer         *bytes.Buffer
}

func newFileWriter(
	filename string,
	packageName string,
	baseImportPath string,
	types map[ir.TypeId]*ir.TypeDeclaration,
) *fileWriter {
	// The default set of imports used in the generated output.
	// These imports are removed from the generated output if
	// they aren't used.
	imports := make(imports)
	imports.Add("fmt")
	imports.Add("encoding/json")
	imports.Add("strconv")
	imports.Add("time")
	imports.Add("github.com/gofrs/uuid")

	return &fileWriter{
		filename:       filename,
		packageName:    packageName,
		baseImportPath: baseImportPath,
		imports:        imports,
		types:          types,
		buffer:         new(bytes.Buffer),
	}
}

// P writes the given element into a single line, concluding with a newline.
func (f *fileWriter) P(elements ...any) {
	for _, element := range elements {
		fmt.Fprint(f.buffer, element)
	}
	fmt.Fprintln(f.buffer)
}

// File formats and writes the content stored in the writer's buffer into a *File.
func (f *fileWriter) File() (*File, error) {
	// Start with the package declaration and import statements.
	header := newFileWriter(f.filename, f.packageName, f.baseImportPath, f.types)
	header.P(fileHeader)
	header.P("package ", f.packageName)
	header.P("import (")
	for importDecl, importAlias := range f.imports {
		header.P(fmt.Sprintf("%s %q", importAlias, importDecl))
	}
	header.P(")")

	formatted, err := removeUnusedImports(f.filename, append(header.buffer.Bytes(), f.buffer.Bytes()...))
	if err != nil {
		return nil, err
	}
	return &File{
		Path:    f.filename,
		Content: formatted,
	}, nil
}

// DocsFile acts like File, but is tailored to write docs.go files.
func (f *fileWriter) DocsFile() (*File, error) {
	f.P("package ", f.packageName)
	return &File{
		Path:    f.filename,
		Content: append([]byte(fileHeader), f.buffer.Bytes()...),
	}, nil
}

// WriteType writes a complete type, including all of its properties.
func (f *fileWriter) WriteType(typeDeclaration *ir.TypeDeclaration) error {
	visitor := &typeVisitor{
		typeName:       typeDeclaration.Name.Name.PascalCase.UnsafeName,
		baseImportPath: f.baseImportPath,
		importPath:     fernFilepathToImportPath(f.baseImportPath, typeDeclaration.Name.FernFilepath),
		writer:         f,
	}
	f.WriteDocs(typeDeclaration.Docs)
	return typeDeclaration.Shape.Accept(visitor)
}

// WriteDocs is a convenience function to writes the given documentation, if any.
// This prevents us from having to perform a nil check and length check at every
// call site.
func (f *fileWriter) WriteDocs(docs *string) {
	if docs == nil || len(*docs) == 0 {
		return
	}
	split := strings.Split(*docs, "\n")
	for _, line := range split {
		f.P("// " + line)
	}
}

// typeReferenceToGoType maps the given type reference into its Go-equivalent.
func typeReferenceToGoType(
	typeReference *ir.TypeReference,
	types map[ir.TypeId]*ir.TypeDeclaration,
	imports imports,
	baseImportPath string,
	importPath string,
) string {
	visitor := &typeReferenceVisitor{
		baseImportPath: baseImportPath,
		importPath:     importPath,
		imports:        imports,
		types:          types,
	}
	_ = typeReference.Accept(visitor)
	return visitor.value
}

// containerTypeToGoType maps the given container type into its Go-equivalent.
func containerTypeToGoType(
	containerType *ir.ContainerType,
	types map[ir.TypeId]*ir.TypeDeclaration,
	imports imports,
	baseImportPath string,
	importPath string,
) string {
	visitor := &containerTypeVisitor{
		baseImportPath: baseImportPath,
		importPath:     importPath,
		imports:        imports,
		types:          types,
	}
	_ = containerType.Accept(visitor)
	return visitor.value
}

// singleUnionTypePropertiesToGoType maps the given container type into its Go-equivalent.
func singleUnionTypePropertiesToGoType(
	singleUnionTypeProperties *ir.SingleUnionTypeProperties,
	types map[ir.TypeId]*ir.TypeDeclaration,
	imports imports,
	baseImportPath string,
	importPath string,
) string {
	visitor := &singleUnionTypePropertiesVisitor{
		baseImportPath: baseImportPath,
		importPath:     importPath,
		imports:        imports,
		types:          types,
	}
	_ = singleUnionTypeProperties.Accept(visitor)
	return visitor.value
}

// singleUnionTypePropertiesToInitializer maps the given container type into its Go-equivalent initializer.
//
// Note this returns the string representation of the statement required to initialize
// the given property, e.g. 'value := new(Foo)'
func singleUnionTypePropertiesToInitializer(
	singleUnionTypeProperties *ir.SingleUnionTypeProperties,
	types map[ir.TypeId]*ir.TypeDeclaration,
	imports imports,
	baseImportPath string,
	importPath string,
	discriminantName string,
) string {
	visitor := &singleUnionTypePropertiesInitializerVisitor{
		discriminantName: discriminantName,
		baseImportPath:   baseImportPath,
		importPath:       importPath,
		imports:          imports,
		types:            types,
	}
	_ = singleUnionTypeProperties.Accept(visitor)
	return visitor.value
}

// typeReferenceToUndiscriminatedUnionField maps Fern's type references to the field name used in an
// undiscriminated union.
func typeReferenceToUndiscriminatedUnionField(typeReference *ir.TypeReference, types map[ir.TypeId]*ir.TypeDeclaration) string {
	visitor := &undiscriminatedUnionTypeReferenceVisitor{
		types: types,
	}
	_ = typeReference.Accept(visitor)
	return visitor.value
}

// containerToUndiscriminatedUnionField maps Fern's container types to the field name used in an
// undiscriminated union.
func containerToUndiscriminatedUnionField(container *ir.ContainerType, types map[ir.TypeId]*ir.TypeDeclaration) string {
	visitor := &undiscriminatedUnionContainerTypeVisitor{
		types: types,
	}
	_ = container.Accept(visitor)
	return visitor.value
}

// literalToGoType maps the given literal into its Go-equivalent.
func literalToGoType(literal *ir.Literal) string {
	visitor := new(literalTypeVisitor)
	_ = literal.Accept(visitor)
	return visitor.value
}

// literalToValue maps the given literal into its value.
func literalToValue(literal *ir.Literal) string {
	visitor := new(literalValueVisitor)
	_ = literal.Accept(visitor)
	return visitor.value
}

// typeVisitor writes the internal properties of types (e.g. properties).
type typeVisitor struct {
	typeName       string
	baseImportPath string
	importPath     string
	writer         *fileWriter
}

// Compile-time assertion.
var _ ir.TypeVisitor = (*typeVisitor)(nil)

func (t *typeVisitor) VisitAlias(alias *ir.AliasTypeDeclaration) error {
	t.writer.P("type ", t.typeName, " = ", typeReferenceToGoType(alias.AliasOf, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath))
	t.writer.P()
	return nil
}

func (t *typeVisitor) VisitEnum(enum *ir.EnumTypeDeclaration) error {
	// Write the enum type definition.
	t.writer.P("type ", t.typeName, " uint8")
	t.writer.P()

	// Write all of the supported enum values in a single const block.
	t.writer.P("const (")
	for i, enumValue := range enum.Values {
		t.writer.WriteDocs(enumValue.Docs)
		enumName := t.typeName + enumValue.Name.Name.PascalCase.UnsafeName
		if i == 0 {
			t.writer.P(enumName, " ", t.typeName, " = iota + 1")
			continue
		}
		t.writer.P(enumName)
	}
	t.writer.P(")")
	t.writer.P()

	// Implement the fmt.Stringer interface.
	t.writer.P("func (x ", t.typeName, ") String() string {")
	t.writer.P("switch x {")
	for i, enumValue := range enum.Values {
		if i == 0 {
			// Implement the default case first.
			t.writer.P("default:")
			t.writer.P("return strconv.Itoa(int(x))")
		}
		enumName := t.typeName + enumValue.Name.Name.PascalCase.UnsafeName
		t.writer.P("case ", enumName, ":")
		t.writer.P("return \"", enumValue.Name.WireValue, "\"")
	}
	t.writer.P("}")
	t.writer.P("}")
	t.writer.P()

	// Implement the json.Marshaler interface.
	t.writer.P("func (x ", t.typeName, ") MarshalJSON() ([]byte, error) {")
	t.writer.P("return []byte(fmt.Sprintf(\"%q\", x.String())), nil")
	t.writer.P("}")
	t.writer.P()

	// Implement the json.Unmarshaler interface.
	t.writer.P("func (x *", t.typeName, ") UnmarshalJSON(data []byte) error {")
	t.writer.P("var raw string")
	t.writer.P("if err := json.Unmarshal(data, &raw); err != nil {")
	t.writer.P("return err")
	t.writer.P("}")
	t.writer.P("switch raw {")
	for _, enumValue := range enum.Values {
		enumName := t.typeName + enumValue.Name.Name.PascalCase.UnsafeName
		t.writer.P("case \"", enumValue.Name.WireValue, "\":")
		t.writer.P("value := ", enumName)
		t.writer.P("*x = value")
	}
	t.writer.P("}")
	t.writer.P("return nil")
	t.writer.P("}")
	t.writer.P()

	return nil
}

func (t *typeVisitor) VisitObject(object *ir.ObjectTypeDeclaration) error {
	t.writer.P("type ", t.typeName, " struct {")
	_, literals := t.visitObjectProperties(object, true /* includeTags */)

	if len(literals) == 0 {
		t.writer.P("}")
		t.writer.P()
		return nil
	}

	// If the object has a literal, it needs custom [de]serialization logic,
	// and a getter method to access the field so that it's impossible for
	// the user to mutate it.
	//
	// Literals are ignored in visitObjectProperties, so we need to write them
	// here.
	for _, literal := range literals {
		t.writer.P(literal.Name.CamelCase.SafeName, " ", literalToGoType(literal.Value))
	}
	t.writer.P("}")
	t.writer.P()

	// Implement the getter methods.
	for _, literal := range literals {
		t.writer.P("func (x *", t.typeName, ") ", literal.Name.PascalCase.UnsafeName, "()", literalToGoType(literal.Value), "{")
		t.writer.P("return x.", literal.Name.CamelCase.SafeName)
		t.writer.P("}")
		t.writer.P()
	}

	// Implement the json.Unmarshaler interface.
	t.writer.P("func (x *", t.typeName, ") UnmarshalJSON(data []byte) error {")
	t.writer.P("type unmarshaler ", t.typeName)
	t.writer.P("var value unmarshaler")
	t.writer.P("if err := json.Unmarshal(data, &value); err != nil {")
	t.writer.P("return err")
	t.writer.P("}")
	t.writer.P("*x = ", t.typeName, "(value)")
	for _, literal := range literals {
		t.writer.P("x.", literal.Name.CamelCase.SafeName, " = ", literalToValue(literal.Value))
	}
	t.writer.P("return nil")
	t.writer.P("}")
	t.writer.P()

	// Implement the json.Marshaler interface.
	t.writer.P("func (x *", t.typeName, ") MarshalJSON() ([]byte, error) {")
	t.writer.P("type embed ", t.typeName)
	t.writer.P("var marshaler = struct{")
	t.writer.P("embed")
	for _, literal := range literals {
		t.writer.P(literal.Name.PascalCase.UnsafeName, " ", literalToGoType(literal.Value), " `json:\"", literal.Name.OriginalName, "\"`")
	}
	t.writer.P("}{")
	t.writer.P("embed: embed(*x),")
	for _, literal := range literals {
		t.writer.P(literal.Name.PascalCase.UnsafeName, ": ", literalToValue(literal.Value), ",")
	}
	t.writer.P("}")
	t.writer.P("return json.Marshal(marshaler)")
	t.writer.P("}")
	t.writer.P()
	return nil
}

// TODO: Ensure extended literal properties are generated.
// TODO: Modify json.Unmarshaler and json.Marshaler based
// on literal values.
func (t *typeVisitor) VisitUnion(union *ir.UnionTypeDeclaration) error {
	// Write the union type definition.
	discriminantName := union.Discriminant.Name.PascalCase.UnsafeName
	t.writer.P("type ", t.typeName, " struct {")
	t.writer.P(discriminantName, " string")
	var literals []*literal
	for _, extend := range union.Extends {
		_, extendedLiterals := t.visitObjectProperties(t.writer.types[extend.TypeId].Shape.Object, false /* includeTags */)
		literals = append(literals, extendedLiterals...)
	}
	for _, property := range union.BaseProperties {
		if property.ValueType.Container != nil && property.ValueType.Container.Literal != nil {
			literals = append(literals, &literal{Name: property.Name.Name, Value: property.ValueType.Container.Literal})
			continue
		}
		t.writer.P(property.Name.Name.PascalCase.UnsafeName, " ", typeReferenceToGoType(property.ValueType, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath))
	}
	for _, unionType := range union.Types {
		typeName := singleUnionTypePropertiesToGoType(unionType.Shape, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath)
		if typeName == "" {
			// If the union has no properties, there's nothing for us to do.
			continue
		}
		t.writer.WriteDocs(unionType.Docs)
		t.writer.P(unionType.DiscriminantValue.Name.PascalCase.UnsafeName, " ", typeName)
	}
	for _, literal := range literals {
		t.writer.P(literal.Name.CamelCase.SafeName, " ", literalToGoType(literal.Value))
	}
	t.writer.P("}")
	t.writer.P()

	// Implement the getter methods.
	for _, literal := range literals {
		t.writer.P("func (x *", t.typeName, ") ", literal.Name.PascalCase.UnsafeName, "()", literalToGoType(literal.Value), "{")
		t.writer.P("return x.", literal.Name.CamelCase.SafeName)
		t.writer.P("}")
		t.writer.P()
	}

	// Implement the json.Unmarshaler interface.
	t.writer.P("func (x *", t.typeName, ") UnmarshalJSON(data []byte) error {")
	t.writer.P("var unmarshaler struct {")
	t.writer.P(discriminantName, " string `json:\"", union.Discriminant.WireValue, "\"`")
	var propertyNames []string
	for _, extend := range union.Extends {
		extendedProperties, _ := t.visitObjectProperties(t.writer.types[extend.TypeId].Shape.Object, true /* includeTags */)
		propertyNames = append(propertyNames, extendedProperties...)
	}
	for _, property := range union.BaseProperties {
		if property.ValueType.Container != nil && property.ValueType.Container.Literal != nil {
			continue
		}
		propertyNames = append(propertyNames, property.Name.Name.PascalCase.UnsafeName)
		t.writer.P(property.Name.Name.PascalCase.UnsafeName, " ", typeReferenceToGoType(property.ValueType, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath), " `json:\"", property.Name.Name.CamelCase.UnsafeName, "\"`")
	}
	t.writer.P("}")
	t.writer.P("if err := json.Unmarshal(data, &unmarshaler); err != nil {")
	t.writer.P("return err")
	t.writer.P("}")

	// Set the union's type on the exported type, plus all of the other
	// extended and/or base properties.
	t.writer.P("x.", discriminantName, " = unmarshaler.", discriminantName)
	for _, propertyName := range propertyNames {
		t.writer.P("x.", propertyName, " = unmarshaler.", propertyName)
	}
	// TODO: Set the literal values on the receiver.

	// Generate the switch to unmarshal the appropriate type.
	t.writer.P("switch unmarshaler.", discriminantName, " {")
	for _, unionType := range union.Types {
		t.writer.P("case \"", unionType.DiscriminantValue.Name.OriginalName, "\":")
		if unionType.Shape.PropertiesType == "singleProperty" {
			// If the union is a single property, we need a separate unmarshaler.
			// We can't use the top-level unmarshaler because of potential property
			// serde name conflicts, e.g.
			//
			//  type unmarshaler struct {
			//    String string `json:"value"`
			//    Boolean bool  `json:"value"`
			//  }
			t.writer.P("var valueUnmarshaler struct {")
			typeName := singleUnionTypePropertiesToGoType(unionType.Shape, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath)
			t.writer.P(unionType.DiscriminantValue.Name.PascalCase.UnsafeName, " ", typeName, " `json:\"", unionType.Shape.SingleProperty.Name.Name.CamelCase.UnsafeName, "\"`")
			t.writer.P("}")
			t.writer.P("if err := json.Unmarshal(data, &valueUnmarshaler); err != nil {")
			t.writer.P("return err")
			t.writer.P("}")
			t.writer.P("x.", unionType.DiscriminantValue.Name.PascalCase.UnsafeName, " = valueUnmarshaler.", unionType.DiscriminantValue.Name.PascalCase.UnsafeName)
			continue
		}
		t.writer.P(singleUnionTypePropertiesToInitializer(unionType.Shape, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath, unionType.DiscriminantValue.Name.PascalCase.UnsafeName))
		t.writer.P("if err := json.Unmarshal(data, &value); err != nil {")
		t.writer.P("return err")
		t.writer.P("}")
		t.writer.P("x.", unionType.DiscriminantValue.Name.PascalCase.UnsafeName, " = value")
	}
	t.writer.P("}")
	t.writer.P("return nil")
	t.writer.P("}")
	t.writer.P()

	// Implement the json.Marshaler interface.
	t.writer.P("func (x ", t.typeName, ") MarshalJSON() ([]byte, error) {")
	t.writer.P("switch x.", discriminantName, " {")
	for i, unionType := range union.Types {
		if i == 0 {
			// Implement the default case first.
			t.writer.P("default:")
			t.writer.P("return nil, fmt.Errorf(\"invalid type %s in %T\", x.", discriminantName, ", x)")
		}
		t.writer.P("case \"", unionType.DiscriminantValue.Name.OriginalName, "\":")
		t.writer.P("var marshaler = struct {")
		t.writer.P(discriminantName, " string `json:\"", union.Discriminant.WireValue, "\"`")
		// Include all of the extended and base properties.
		for _, extend := range union.Extends {
			_, _ = t.visitObjectProperties(t.writer.types[extend.TypeId].Shape.Object, true /* includeTags */)
		}
		for _, property := range union.BaseProperties {
			if property.ValueType.Container != nil && property.ValueType.Container.Literal != nil {
				continue
			}
			t.writer.P(property.Name.Name.PascalCase.UnsafeName, " ", typeReferenceToGoType(property.ValueType, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath), " `json:\"", property.Name.Name.CamelCase.UnsafeName, "\"`")
		}
		// TODO: Include the literal fields.
		typeName := singleUnionTypePropertiesToGoType(unionType.Shape, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath)
		switch unionType.Shape.PropertiesType {
		case "singleProperty":
			t.writer.P(unionType.DiscriminantValue.Name.PascalCase.UnsafeName, " ", typeName, " `json:\"", unionType.Shape.SingleProperty.Name.Name.CamelCase.UnsafeName, "\"`")
		case "samePropertiesAsObject":
			t.writer.P(typeName)
		case "noProperties":
			t.writer.P(unionType.DiscriminantValue.Name.PascalCase.UnsafeName, " ", typeName, " `json:\"", unionType.DiscriminantValue.Name.CamelCase.UnsafeName, "\"`")
		}
		// Set all of the values in the marshaler.
		t.writer.P("}{")
		t.writer.P(discriminantName, ": x.", discriminantName, ",")
		for _, propertyName := range propertyNames {
			t.writer.P(propertyName, ": x.", propertyName, ",")
		}
		// TODO: Include the literal fields.
		marshalerFieldName := unionType.DiscriminantValue.Name.PascalCase.UnsafeName
		if unionType.Shape.PropertiesType == "samePropertiesAsObject" {
			// If the object is embedded, the field name is equivalent to
			// the object's name, without any leading pointers.
			marshalerFieldName = typeNameToFieldName(typeName)
		}
		t.writer.P(marshalerFieldName, ": x.", unionType.DiscriminantValue.Name.PascalCase.UnsafeName, ",")
		t.writer.P("}")
		t.writer.P("return json.Marshal(marshaler)")
	}
	t.writer.P("}")
	t.writer.P("}")
	t.writer.P()

	// Generate the Visitor interface.
	t.writer.P("type ", t.typeName, "Visitor interface {")
	for _, unionType := range union.Types {
		t.writer.P("Visit", unionType.DiscriminantValue.Name.PascalCase.UnsafeName, "(", singleUnionTypePropertiesToGoType(unionType.Shape, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath), ") error")
	}
	t.writer.P("}")
	t.writer.P()

	// Generate the Accept method.
	t.writer.P("func (x *", t.typeName, ") Accept(v ", t.typeName, "Visitor) error {")
	t.writer.P("switch x.", discriminantName, "{")
	for i, unionType := range union.Types {
		if i == 0 {
			// Implement the default case first.
			t.writer.P("default:")
			t.writer.P("return fmt.Errorf(\"invalid type %s in %T\", x.", discriminantName, ", x)")
		}
		t.writer.P("case \"", unionType.DiscriminantValue.Name.OriginalName, "\":")
		t.writer.P("return v.Visit", unionType.DiscriminantValue.Name.PascalCase.UnsafeName, "(x.", unionType.DiscriminantValue.Name.PascalCase.UnsafeName, ")")
	}
	t.writer.P("}")
	t.writer.P("}")
	t.writer.P()

	return nil
}

func (t *typeVisitor) VisitUndiscriminatedUnion(union *ir.UndiscriminatedUnionTypeDeclaration) error {
	// member represents a single undiscriminated union member.
	//
	// We define a separate struct here so that we can collect
	// all of the relevant information upfront, and traverse it
	// multiple times seamlessly (and in the order they're specified).
	type member struct {
		typeName string
		field    string
		value    string
		docs     *string
	}
	var members []*member
	for _, unionMember := range union.Members {
		var typeName string
		if unionMember.Type.Named != nil {
			typeName = unionMember.Type.Named.TypeId
		}
		members = append(
			members,
			&member{
				typeName: typeName,
				field:    typeReferenceToUndiscriminatedUnionField(unionMember.Type, t.writer.types),
				value:    typeReferenceToGoType(unionMember.Type, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath),
				docs:     unionMember.Docs,
			},
		)
	}

	// Write the union type definition.
	t.writer.P("type ", t.typeName, " struct {")
	t.writer.P("typeName string")
	for _, member := range members {
		t.writer.WriteDocs(member.docs)
		t.writer.P(member.field, " ", member.value)
	}
	t.writer.P("}")
	t.writer.P()

	// Implement the json.Unmarshaler interface.
	t.writer.P("func (x *", t.typeName, ") UnmarshalJSON(data []byte) error {")
	for _, member := range members {
		value := member.value
		format := "var " + member.field + " %s"
		if member.typeName != "" && isPointer(t.writer.types[member.typeName]) {
			format = member.field + " := new(%s)"
			value = strings.TrimLeft(value, "*")
		}
		t.writer.P(fmt.Sprintf(format, value))
		t.writer.P("if err := json.Unmarshal(data, &", member.field, "); err == nil {")
		t.writer.P("x.typeName = \"", member.field, "\"")
		t.writer.P("x.", member.field, " = ", member.field)
		t.writer.P("return nil")
		t.writer.P("}")
	}
	t.writer.P(`return fmt.Errorf("%s cannot be deserialized as a %T", data, x)`)
	t.writer.P("}")
	t.writer.P()

	t.writer.P("func (x ", t.typeName, ") MarshalJSON() ([]byte, error) {")
	t.writer.P("switch x.typeName {")
	for i, member := range members {
		if i == 0 {
			// Implement the default case first.
			t.writer.P("default:")
			t.writer.P("return nil, fmt.Errorf(\"invalid type %s in %T\", x.typeName, x)")
		}
		t.writer.P("case \"", member.field, "\":")
		t.writer.P("return json.Marshal(x.", member.field, ")")
	}
	t.writer.P("}")
	t.writer.P("}")
	t.writer.P()

	// Generate the Visitor interface.
	t.writer.P("type ", t.typeName, "Visitor interface {")
	for _, member := range members {
		t.writer.P("Visit", member.field, "(", member.value, ") error")
	}
	t.writer.P("}")
	t.writer.P()

	// Generate the Accept method.
	t.writer.P("func (x *", t.typeName, ") Accept(v ", t.typeName, "Visitor) error {")
	t.writer.P("switch x.typeName {")
	for i, member := range members {
		if i == 0 {
			// Implement the default case first.
			t.writer.P("default:")
			t.writer.P("return fmt.Errorf(\"invalid type %s in %T\", x.typeName, x)")
		}
		t.writer.P("case \"", member.field, "\":")
		t.writer.P("return v.Visit", member.field, "(x.", member.field, ")")
	}
	t.writer.P("}")
	t.writer.P("}")
	t.writer.P()

	return nil
}

// undiscriminatedUnionTypeReferenceVisitor retrieves the string representation of type references
// (e.g. containers, primitives, etc), but specifically for undiscriminated union generation.
type undiscriminatedUnionTypeReferenceVisitor struct {
	value string
	types map[ir.TypeId]*ir.TypeDeclaration
}

// Compile-time assertion.
var _ ir.TypeReferenceVisitor = (*undiscriminatedUnionTypeReferenceVisitor)(nil)

func (u *undiscriminatedUnionTypeReferenceVisitor) VisitContainer(container *ir.ContainerType) error {
	u.value = containerToUndiscriminatedUnionField(container, u.types)
	return nil
}

func (u *undiscriminatedUnionTypeReferenceVisitor) VisitNamed(named *ir.DeclaredTypeName) error {
	u.value = named.Name.PascalCase.UnsafeName
	return nil
}

func (u *undiscriminatedUnionTypeReferenceVisitor) VisitPrimitive(primitive ir.PrimitiveType) error {
	u.value = primitiveToUndiscriminatedUnionField(primitive)
	return nil
}

func (u *undiscriminatedUnionTypeReferenceVisitor) VisitUnknown(unknown any) error {
	u.value = "Unknown"
	return nil
}

// undiscriminatedUnionContainerTypeVisitor retrieves the string representation of container types
// (e.g. lists, maps, etc).
type undiscriminatedUnionContainerTypeVisitor struct {
	value string
	types map[ir.TypeId]*ir.TypeDeclaration
}

// Compile-time assertion.
var _ ir.ContainerTypeVisitor = (*undiscriminatedUnionContainerTypeVisitor)(nil)

func (u *undiscriminatedUnionContainerTypeVisitor) VisitList(list *ir.TypeReference) error {
	u.value = fmt.Sprintf("%sList", typeReferenceToUndiscriminatedUnionField(list, u.types))
	return nil
}

func (u *undiscriminatedUnionContainerTypeVisitor) VisitMap(mapType *ir.MapType) error {
	u.value = fmt.Sprintf(
		"%s%sMap",
		typeReferenceToUndiscriminatedUnionField(mapType.KeyType, u.types),
		typeReferenceToUndiscriminatedUnionField(mapType.ValueType, u.types),
	)
	return nil
}

func (u *undiscriminatedUnionContainerTypeVisitor) VisitOptional(optional *ir.TypeReference) error {
	u.value = fmt.Sprintf("%sOptional", typeReferenceToUndiscriminatedUnionField(optional, u.types))
	return nil
}

func (u *undiscriminatedUnionContainerTypeVisitor) VisitSet(set *ir.TypeReference) error {
	u.value = fmt.Sprintf("%sSet", typeReferenceToUndiscriminatedUnionField(set, u.types))
	return nil
}

func (u *undiscriminatedUnionContainerTypeVisitor) VisitLiteral(literal *ir.Literal) error {
	u.value = fmt.Sprintf("%sLiteral", literalToUndiscriminatedUnionField(literal))
	return nil
}

// literal contains the information required to generate code for literal properties.
type literal struct {
	Name  *ir.Name
	Value *ir.Literal
}

// visitObjectProperties writes all of this object's properties, and recursively calls itself with
// the object's extended properties (if any). The 'includeTags' parameter controls whether or not
// to generate JSON struct tags, which is only relevant for object types (not unions).
//
// A slice of all the transitive property names, as well as a sentinel value that signals whether
// any of the properties are a literal value, are returned.
func (t *typeVisitor) visitObjectProperties(object *ir.ObjectTypeDeclaration, includeTags bool) ([]string, []*literal) {
	var names []string
	var literals []*literal
	for _, extend := range object.Extends {
		// You can only extend other objects.
		extendedNames, extendedLiterals := t.visitObjectProperties(t.writer.types[extend.TypeId].Shape.Object, includeTags)
		names = append(names, extendedNames...)
		literals = append(literals, extendedLiterals...)
	}
	for _, property := range object.Properties {
		t.writer.WriteDocs(property.Docs)
		if property.ValueType.Container != nil && property.ValueType.Container.Literal != nil {
			literals = append(literals, &literal{Name: property.Name.Name, Value: property.ValueType.Container.Literal})
			continue
		}
		names = append(names, property.Name.Name.PascalCase.UnsafeName)
		if includeTags {
			t.writer.P(property.Name.Name.PascalCase.UnsafeName, " ", typeReferenceToGoType(property.ValueType, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath), " `json:\"", property.Name.Name.CamelCase.UnsafeName, "\"`")
			continue
		}
		t.writer.P(property.Name.Name.PascalCase.UnsafeName, " ", typeReferenceToGoType(property.ValueType, t.writer.types, t.writer.imports, t.baseImportPath, t.importPath))
	}
	return names, literals
}

// typeReferenceVisitor retrieves the string representation of type references
// (e.g. containers, primitives, etc).
type typeReferenceVisitor struct {
	value          string
	baseImportPath string
	importPath     string
	imports        imports
	types          map[ir.TypeId]*ir.TypeDeclaration
}

// Compile-time assertion.
var _ ir.TypeReferenceVisitor = (*typeReferenceVisitor)(nil)

func (t *typeReferenceVisitor) VisitContainer(container *ir.ContainerType) error {
	t.value = containerTypeToGoType(container, t.types, t.imports, t.baseImportPath, t.importPath)
	return nil
}

func (t *typeReferenceVisitor) VisitNamed(named *ir.DeclaredTypeName) error {
	format := "%s"
	if isPointer(t.types[named.TypeId]) {
		format = "*%s"
	}
	name := named.Name.PascalCase.UnsafeName
	if importPath := fernFilepathToImportPath(t.baseImportPath, named.FernFilepath); importPath != t.importPath {
		name = t.imports.Add(importPath) + "." + name
	}
	t.value = fmt.Sprintf(format, name)
	return nil
}

func (t *typeReferenceVisitor) VisitPrimitive(primitive ir.PrimitiveType) error {
	t.value = primitiveToGoType(primitive)
	return nil
}

func (t *typeReferenceVisitor) VisitUnknown(unknown any) error {
	t.value = unknownToGoType(unknown)
	return nil
}

// containerTypeVisitor retrieves the string representation of container types
// (e.g. lists, maps, etc).
type containerTypeVisitor struct {
	value          string
	baseImportPath string
	importPath     string
	imports        imports
	types          map[ir.TypeId]*ir.TypeDeclaration
}

// Compile-time assertion.
var _ ir.ContainerTypeVisitor = (*containerTypeVisitor)(nil)

func (c *containerTypeVisitor) VisitList(list *ir.TypeReference) error {
	c.value = fmt.Sprintf("[]%s", typeReferenceToGoType(list, c.types, c.imports, c.baseImportPath, c.importPath))
	return nil
}

func (c *containerTypeVisitor) VisitMap(mapType *ir.MapType) error {
	c.value = fmt.Sprintf("map[%s]%s", typeReferenceToGoType(mapType.KeyType, c.types, c.imports, c.baseImportPath, c.importPath), typeReferenceToGoType(mapType.ValueType, c.types, c.imports, c.baseImportPath, c.importPath))
	return nil
}

func (c *containerTypeVisitor) VisitOptional(optional *ir.TypeReference) error {
	// Trim all of the preceding pointers from the underlying type so that we don't
	// unnecessarily generate double pointers for objects and unions (e.g. '**Foo)').
	c.value = fmt.Sprintf("*%s", strings.TrimLeft(typeReferenceToGoType(optional, c.types, c.imports, c.baseImportPath, c.importPath), "*"))
	return nil
}

func (c *containerTypeVisitor) VisitSet(set *ir.TypeReference) error {
	c.value = fmt.Sprintf("[]%s", typeReferenceToGoType(set, c.types, c.imports, c.baseImportPath, c.importPath))
	return nil
}

func (c *containerTypeVisitor) VisitLiteral(literal *ir.Literal) error {
	c.value = literalToGoType(literal)
	return nil
}

// singleUnionTypePropertiesVisitor retrieves the string representation of
// single union type properties.
type singleUnionTypePropertiesVisitor struct {
	value          string
	baseImportPath string
	importPath     string
	imports        imports
	types          map[ir.TypeId]*ir.TypeDeclaration
}

// Compile-time assertion.
var _ ir.SingleUnionTypePropertiesVisitor = (*singleUnionTypePropertiesVisitor)(nil)

func (c *singleUnionTypePropertiesVisitor) VisitSamePropertiesAsObject(named *ir.DeclaredTypeName) error {
	format := "%s"
	if isPointer(c.types[named.TypeId]) {
		format = "*%s"
	}
	name := named.Name.PascalCase.UnsafeName
	if importPath := fernFilepathToImportPath(c.baseImportPath, named.FernFilepath); importPath != c.importPath {
		name = c.imports.Add(importPath) + "." + name
	}
	c.value = fmt.Sprintf(format, name)
	return nil
}

func (c *singleUnionTypePropertiesVisitor) VisitSingleProperty(property *ir.SingleUnionTypeProperty) error {
	c.value = typeReferenceToGoType(property.Type, c.types, c.imports, c.baseImportPath, c.importPath)
	return nil
}

func (c *singleUnionTypePropertiesVisitor) VisitNoProperties(_ any) error {
	c.value = "any"
	return nil
}

// singleUnionTypePropertiesInitializerVisitor retrieves the string representation of
// single union type property initializers.
//
// This visitor determines the string representation of the constructor used
// in the json.Unmarshaler implementation.
type singleUnionTypePropertiesInitializerVisitor struct {
	value            string
	discriminantName string
	baseImportPath   string
	importPath       string
	imports          imports
	types            map[ir.TypeId]*ir.TypeDeclaration
}

// Compile-time assertion.
var _ ir.SingleUnionTypePropertiesVisitor = (*singleUnionTypePropertiesInitializerVisitor)(nil)

func (c *singleUnionTypePropertiesInitializerVisitor) VisitSamePropertiesAsObject(named *ir.DeclaredTypeName) error {
	format := "var value %s"
	if isPointer(c.types[named.TypeId]) {
		format = "value := new(%s)"
	}
	name := named.Name.PascalCase.UnsafeName
	if importPath := fernFilepathToImportPath(c.baseImportPath, named.FernFilepath); importPath != c.importPath {
		name = c.imports.Add(importPath) + "." + name
	}
	c.value = fmt.Sprintf(format, name)
	return nil
}

func (c *singleUnionTypePropertiesInitializerVisitor) VisitSingleProperty(_ *ir.SingleUnionTypeProperty) error {
	c.value = fmt.Sprintf("x.%s = unmarshaler.%s", c.discriminantName, c.discriminantName)
	return nil
}

func (c *singleUnionTypePropertiesInitializerVisitor) VisitNoProperties(_ any) error {
	c.value = "value := make(map[string]any)"
	return nil
}

// literalValueVisitor retrieves the string representation of the literal value.
// Strings are the only supported literals for now.
type literalValueVisitor struct {
	value string
}

// Compile-time assertion.
var _ ir.LiteralVisitor = (*literalValueVisitor)(nil)

func (l *literalValueVisitor) VisitString(value string) error {
	l.value = fmt.Sprintf("%q", value)
	return nil
}

// literalTypeVisitor retrieves the string representation of the literal's type.
// Strings are the only supported literals for now.
type literalTypeVisitor struct {
	value string
}

// Compile-time assertion.
var _ ir.LiteralVisitor = (*literalTypeVisitor)(nil)

func (l *literalTypeVisitor) VisitString(value string) error {
	l.value = "string"
	return nil
}

// unknownToGoType maps the given unknown into its Go-equivalent.
func unknownToGoType(_ any) string {
	return "any"
}

// literalToUndiscriminatedUnionField maps Fern's literal types to the field name used in an
// undiscriminated union.
func literalToUndiscriminatedUnionField(literal *ir.Literal) string {
	switch literal.Type {
	case "string":
		return "String"
	default:
		return "Unknown"
	}
}

// primitiveToGoType maps Fern's primitive types to their Go-equivalent.
func primitiveToGoType(primitive ir.PrimitiveType) string {
	switch primitive {
	case ir.PrimitiveTypeInteger:
		return "int"
	case ir.PrimitiveTypeDouble:
		return "float64"
	case ir.PrimitiveTypeString:
		return "string"
	case ir.PrimitiveTypeBoolean:
		return "bool"
	case ir.PrimitiveTypeLong:
		return "int64"
	case ir.PrimitiveTypeDateTime:
		return "time.Time"
	case ir.PrimitiveTypeDate:
		return "time.Time"
	case ir.PrimitiveTypeUuid:
		return "uuid.UUID"
	case ir.PrimitiveTypeBase64:
		return "[]byte"
	default:
		return "any"
	}
}

// primitiveToUndiscriminatedUnionField maps Fern's primitive types to the field name used in an
// undiscriminated union.
func primitiveToUndiscriminatedUnionField(primitive ir.PrimitiveType) string {
	switch primitive {
	case ir.PrimitiveTypeInteger:
		return "Integer"
	case ir.PrimitiveTypeDouble:
		return "Double"
	case ir.PrimitiveTypeString:
		return "String"
	case ir.PrimitiveTypeBoolean:
		return "Boolean"
	case ir.PrimitiveTypeLong:
		return "Long"
	case ir.PrimitiveTypeDateTime:
		return "DateTime"
	case ir.PrimitiveTypeDate:
		return "Date"
	case ir.PrimitiveTypeUuid:
		return "Uuid"
	case ir.PrimitiveTypeBase64:
		return "Base64"
	default:
		return "Any"
	}
}

// typeNameToFieldName maps the given type name (e.g. *foo.Bar) into its embedded field name
// equivalent (e.g. Bar).
func typeNameToFieldName(typeName string) string {
	if split := strings.Split(typeName, "."); len(split) > 1 {
		return split[len(split)-1]
	}
	return strings.TrimLeft(typeName, "*")
}

// fernFilepathToImportPath maps the given Fern filepath to its
// Go import path.
func fernFilepathToImportPath(baseImportPath string, fernFilepath *ir.FernFilepath) string {
	var packages []string
	for _, packageName := range fernFilepath.PackagePath {
		packages = append(packages, strings.ToLower(packageName.CamelCase.SafeName))
	}
	return path.Join(append([]string{baseImportPath}, packages...)...)
}

// isPointer returns true if the given type is a pointer type (e.g. objects and
// unions). Enums, primitives, and aliases of these types do not require pointers.
func isPointer(typeDeclaration *ir.TypeDeclaration) bool {
	switch typeDeclaration.Shape.Type {
	case "object", "union", "undiscriminatedUnion":
		return true
	case "alias", "enum", "primitive":
		return false
	}
	// Unreachable.
	return false
}

// removeUnusedImports parses the buffer, interpreting it as Go code,
// and removes all unused imports. If successful, the result is then
// formatted.
func removeUnusedImports(filename string, buf []byte) ([]byte, error) {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, filename, buf, parser.ParseComments)
	if err != nil {
		return nil, fmt.Errorf("failed to parse Go code: %v", err)
	}

	imports := make(map[string]string)
	for _, route := range f.Imports {
		importPath, err := strconv.Unquote(route.Path.Value)
		if err != nil {
			// Unreachable. If the file parsed successfully,
			// the unquote will never fail.
			return nil, err
		}
		imports[route.Name.Name] = importPath
	}

	for name, path := range imports {
		if !astutil.UsesImport(f, path) {
			astutil.DeleteNamedImport(fset, f, name, path)
		}
	}

	var buffer bytes.Buffer
	if err := format.Node(&buffer, fset, f); err != nil {
		return nil, fmt.Errorf("failed to format Go code: %v", err)
	}

	return buffer.Bytes(), nil
}
