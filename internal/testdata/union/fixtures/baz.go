// Generated by Fern. Do not edit.

package api

import (
	json "encoding/json"
)

type Baz struct {
	extended string
}

func (x *Baz) Extended() string {
	return x.extended
}

func (x *Baz) UnmarshalJSON(data []byte) error {
	type unmarshaler Baz
	var value unmarshaler
	if err := json.Unmarshal(data, &value); err != nil {
		return err
	}
	*x = Baz(value)
	x.extended = "extended"
	return nil
}

func (x *Baz) MarshalJSON() ([]byte, error) {
	type embed Baz
	var marshaler = struct {
		embed
		Extended string `json:"extended"`
	}{
		embed:    embed(*x),
		Extended: "extended",
	}
	return json.Marshal(marshaler)
}
