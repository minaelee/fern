# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from ...core.datetime_utils import serialize_datetime
from .test_case_result import TestCaseResult


class TestCaseResultWithStdout(pydantic.BaseModel):
    result: TestCaseResult
    stdout: str

    class Partial(typing_extensions.TypedDict):
        result: typing_extensions.NotRequired[TestCaseResult]
        stdout: typing_extensions.NotRequired[str]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @TestCaseResultWithStdout.Validators.root()
            def validate(values: TestCaseResultWithStdout.Partial) -> TestCaseResultWithStdout.Partial:
                ...

            @TestCaseResultWithStdout.Validators.field("result")
            def validate_result(result: TestCaseResult, values: TestCaseResultWithStdout.Partial) -> TestCaseResult:
                ...

            @TestCaseResultWithStdout.Validators.field("stdout")
            def validate_stdout(stdout: str, values: TestCaseResultWithStdout.Partial) -> str:
                ...
        """

        _pre_validators: typing.ClassVar[typing.List[TestCaseResultWithStdout.Validators._PreRootValidator]] = []
        _post_validators: typing.ClassVar[typing.List[TestCaseResultWithStdout.Validators._RootValidator]] = []
        _result_pre_validators: typing.ClassVar[
            typing.List[TestCaseResultWithStdout.Validators.PreResultValidator]
        ] = []
        _result_post_validators: typing.ClassVar[typing.List[TestCaseResultWithStdout.Validators.ResultValidator]] = []
        _stdout_pre_validators: typing.ClassVar[
            typing.List[TestCaseResultWithStdout.Validators.PreStdoutValidator]
        ] = []
        _stdout_post_validators: typing.ClassVar[typing.List[TestCaseResultWithStdout.Validators.StdoutValidator]] = []

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [TestCaseResultWithStdout.Validators._RootValidator], TestCaseResultWithStdout.Validators._RootValidator
        ]:
            ...

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [TestCaseResultWithStdout.Validators._PreRootValidator],
            TestCaseResultWithStdout.Validators._PreRootValidator,
        ]:
            ...

        @classmethod
        def root(cls, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if pre:
                    cls._pre_validators.append(validator)
                else:
                    cls._post_validators.append(validator)
                return validator

            return decorator

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["result"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [TestCaseResultWithStdout.Validators.PreResultValidator],
            TestCaseResultWithStdout.Validators.PreResultValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["result"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [TestCaseResultWithStdout.Validators.ResultValidator], TestCaseResultWithStdout.Validators.ResultValidator
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["stdout"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [TestCaseResultWithStdout.Validators.PreStdoutValidator],
            TestCaseResultWithStdout.Validators.PreStdoutValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["stdout"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [TestCaseResultWithStdout.Validators.StdoutValidator], TestCaseResultWithStdout.Validators.StdoutValidator
        ]:
            ...

        @classmethod
        def field(cls, field_name: str, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if field_name == "result":
                    if pre:
                        cls._result_pre_validators.append(validator)
                    else:
                        cls._result_post_validators.append(validator)
                if field_name == "stdout":
                    if pre:
                        cls._stdout_pre_validators.append(validator)
                    else:
                        cls._stdout_post_validators.append(validator)
                return validator

            return decorator

        class PreResultValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: TestCaseResultWithStdout.Partial) -> typing.Any:
                ...

        class ResultValidator(typing_extensions.Protocol):
            def __call__(self, __v: TestCaseResult, __values: TestCaseResultWithStdout.Partial) -> TestCaseResult:
                ...

        class PreStdoutValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: TestCaseResultWithStdout.Partial) -> typing.Any:
                ...

        class StdoutValidator(typing_extensions.Protocol):
            def __call__(self, __v: str, __values: TestCaseResultWithStdout.Partial) -> str:
                ...

        class _PreRootValidator(typing_extensions.Protocol):
            def __call__(self, __values: typing.Any) -> typing.Any:
                ...

        class _RootValidator(typing_extensions.Protocol):
            def __call__(self, __values: TestCaseResultWithStdout.Partial) -> TestCaseResultWithStdout.Partial:
                ...

    @pydantic.root_validator(pre=True)
    def _pre_validate_test_case_result_with_stdout(
        cls, values: TestCaseResultWithStdout.Partial
    ) -> TestCaseResultWithStdout.Partial:
        for validator in TestCaseResultWithStdout.Validators._pre_validators:
            values = validator(values)
        return values

    @pydantic.root_validator(pre=False)
    def _post_validate_test_case_result_with_stdout(
        cls, values: TestCaseResultWithStdout.Partial
    ) -> TestCaseResultWithStdout.Partial:
        for validator in TestCaseResultWithStdout.Validators._post_validators:
            values = validator(values)
        return values

    @pydantic.validator("result", pre=True)
    def _pre_validate_result(cls, v: TestCaseResult, values: TestCaseResultWithStdout.Partial) -> TestCaseResult:
        for validator in TestCaseResultWithStdout.Validators._result_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("result", pre=False)
    def _post_validate_result(cls, v: TestCaseResult, values: TestCaseResultWithStdout.Partial) -> TestCaseResult:
        for validator in TestCaseResultWithStdout.Validators._result_post_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("stdout", pre=True)
    def _pre_validate_stdout(cls, v: str, values: TestCaseResultWithStdout.Partial) -> str:
        for validator in TestCaseResultWithStdout.Validators._stdout_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("stdout", pre=False)
    def _post_validate_stdout(cls, v: str, values: TestCaseResultWithStdout.Partial) -> str:
        for validator in TestCaseResultWithStdout.Validators._stdout_post_validators:
            v = validator(v, values)
        return v

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        json_encoders = {dt.datetime: serialize_datetime}
