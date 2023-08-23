# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from ...core.datetime_utils import serialize_datetime
from ..commons.language import Language
from ..v_2.resources.problem.files import Files


class WorkspaceStarterFilesResponseV2(pydantic.BaseModel):
    files_by_language: typing.Dict[Language, Files] = pydantic.Field(alias="filesByLanguage")

    class Partial(typing_extensions.TypedDict):
        files_by_language: typing_extensions.NotRequired[typing.Dict[Language, Files]]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @WorkspaceStarterFilesResponseV2.Validators.root()
            def validate(values: WorkspaceStarterFilesResponseV2.Partial) -> WorkspaceStarterFilesResponseV2.Partial:
                ...

            @WorkspaceStarterFilesResponseV2.Validators.field("files_by_language")
            def validate_files_by_language(files_by_language: typing.Dict[Language, Files], values: WorkspaceStarterFilesResponseV2.Partial) -> typing.Dict[Language, Files]:
                ...
        """

        _pre_validators: typing.ClassVar[typing.List[WorkspaceStarterFilesResponseV2.Validators._PreRootValidator]] = []
        _post_validators: typing.ClassVar[typing.List[WorkspaceStarterFilesResponseV2.Validators._RootValidator]] = []
        _files_by_language_pre_validators: typing.ClassVar[
            typing.List[WorkspaceStarterFilesResponseV2.Validators.PreFilesByLanguageValidator]
        ] = []
        _files_by_language_post_validators: typing.ClassVar[
            typing.List[WorkspaceStarterFilesResponseV2.Validators.FilesByLanguageValidator]
        ] = []

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [WorkspaceStarterFilesResponseV2.Validators._RootValidator],
            WorkspaceStarterFilesResponseV2.Validators._RootValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [WorkspaceStarterFilesResponseV2.Validators._PreRootValidator],
            WorkspaceStarterFilesResponseV2.Validators._PreRootValidator,
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
            cls, field_name: typing_extensions.Literal["files_by_language"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [WorkspaceStarterFilesResponseV2.Validators.PreFilesByLanguageValidator],
            WorkspaceStarterFilesResponseV2.Validators.PreFilesByLanguageValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls,
            field_name: typing_extensions.Literal["files_by_language"],
            *,
            pre: typing_extensions.Literal[False] = False,
        ) -> typing.Callable[
            [WorkspaceStarterFilesResponseV2.Validators.FilesByLanguageValidator],
            WorkspaceStarterFilesResponseV2.Validators.FilesByLanguageValidator,
        ]:
            ...

        @classmethod
        def field(cls, field_name: str, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if field_name == "files_by_language":
                    if pre:
                        cls._files_by_language_pre_validators.append(validator)
                    else:
                        cls._files_by_language_post_validators.append(validator)
                return validator

            return decorator

        class PreFilesByLanguageValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: WorkspaceStarterFilesResponseV2.Partial) -> typing.Any:
                ...

        class FilesByLanguageValidator(typing_extensions.Protocol):
            def __call__(
                self, __v: typing.Dict[Language, Files], __values: WorkspaceStarterFilesResponseV2.Partial
            ) -> typing.Dict[Language, Files]:
                ...

        class _PreRootValidator(typing_extensions.Protocol):
            def __call__(self, __values: typing.Any) -> typing.Any:
                ...

        class _RootValidator(typing_extensions.Protocol):
            def __call__(
                self, __values: WorkspaceStarterFilesResponseV2.Partial
            ) -> WorkspaceStarterFilesResponseV2.Partial:
                ...

    @pydantic.root_validator(pre=True)
    def _pre_validate_workspace_starter_files_response_v_2(
        cls, values: WorkspaceStarterFilesResponseV2.Partial
    ) -> WorkspaceStarterFilesResponseV2.Partial:
        for validator in WorkspaceStarterFilesResponseV2.Validators._pre_validators:
            values = validator(values)
        return values

    @pydantic.root_validator(pre=False)
    def _post_validate_workspace_starter_files_response_v_2(
        cls, values: WorkspaceStarterFilesResponseV2.Partial
    ) -> WorkspaceStarterFilesResponseV2.Partial:
        for validator in WorkspaceStarterFilesResponseV2.Validators._post_validators:
            values = validator(values)
        return values

    @pydantic.validator("files_by_language", pre=True)
    def _pre_validate_files_by_language(
        cls, v: typing.Dict[Language, Files], values: WorkspaceStarterFilesResponseV2.Partial
    ) -> typing.Dict[Language, Files]:
        for validator in WorkspaceStarterFilesResponseV2.Validators._files_by_language_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("files_by_language", pre=False)
    def _post_validate_files_by_language(
        cls, v: typing.Dict[Language, Files], values: WorkspaceStarterFilesResponseV2.Partial
    ) -> typing.Dict[Language, Files]:
        for validator in WorkspaceStarterFilesResponseV2.Validators._files_by_language_post_validators:
            v = validator(v, values)
        return v

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {dt.datetime: serialize_datetime}
