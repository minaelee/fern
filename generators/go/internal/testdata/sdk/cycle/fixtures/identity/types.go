// This file was auto-generated by Fern from our API Definition.

package identity

import (
	json "encoding/json"
	fmt "fmt"
	user "github.com/fern-api/fern-go/internal/testdata/sdk/cycle/fixtures/common/user"
	core "github.com/fern-api/fern-go/internal/testdata/sdk/cycle/fixtures/core"
)

type Token struct {
	Username *user.Username `json:"username,omitempty" url:"username,omitempty"`

	_rawJSON json.RawMessage
}

func (t *Token) UnmarshalJSON(data []byte) error {
	type unmarshaler Token
	var value unmarshaler
	if err := json.Unmarshal(data, &value); err != nil {
		return err
	}
	*t = Token(value)
	t._rawJSON = json.RawMessage(data)
	return nil
}

func (t *Token) String() string {
	if len(t._rawJSON) > 0 {
		if value, err := core.StringifyJSON(t._rawJSON); err == nil {
			return value
		}
	}
	if value, err := core.StringifyJSON(t); err == nil {
		return value
	}
	return fmt.Sprintf("%#v", t)
}