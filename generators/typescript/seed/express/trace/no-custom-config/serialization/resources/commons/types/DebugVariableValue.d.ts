/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as SeedTrace from "../../../../api";
import * as core from "../../../../core";
export declare const DebugVariableValue: core.serialization.Schema<serializers.DebugVariableValue.Raw, SeedTrace.DebugVariableValue>;
export declare namespace DebugVariableValue {
    type Raw = DebugVariableValue.IntegerValue | DebugVariableValue.BooleanValue | DebugVariableValue.DoubleValue | DebugVariableValue.StringValue | DebugVariableValue.CharValue | DebugVariableValue.MapValue | DebugVariableValue.ListValue | DebugVariableValue.BinaryTreeNodeValue | DebugVariableValue.SinglyLinkedListNodeValue | DebugVariableValue.DoublyLinkedListNodeValue | DebugVariableValue.UndefinedValue | DebugVariableValue.NullValue | DebugVariableValue.GenericValue;
    interface IntegerValue {
        type: "integerValue";
        value: number;
    }
    interface BooleanValue {
        type: "booleanValue";
        value: boolean;
    }
    interface DoubleValue {
        type: "doubleValue";
        value: number;
    }
    interface StringValue {
        type: "stringValue";
        value: string;
    }
    interface CharValue {
        type: "charValue";
        value: string;
    }
    interface MapValue extends serializers.DebugMapValue.Raw {
        type: "mapValue";
    }
    interface ListValue {
        type: "listValue";
        value: serializers.DebugVariableValue.Raw[];
    }
    interface BinaryTreeNodeValue extends serializers.BinaryTreeNodeAndTreeValue.Raw {
        type: "binaryTreeNodeValue";
    }
    interface SinglyLinkedListNodeValue extends serializers.SinglyLinkedListNodeAndListValue.Raw {
        type: "singlyLinkedListNodeValue";
    }
    interface DoublyLinkedListNodeValue extends serializers.DoublyLinkedListNodeAndListValue.Raw {
        type: "doublyLinkedListNodeValue";
    }
    interface UndefinedValue {
        type: "undefinedValue";
    }
    interface NullValue {
        type: "nullValue";
    }
    interface GenericValue extends serializers.GenericValue.Raw {
        type: "genericValue";
    }
}
