# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import typing

import typing_extensions

from .......commons.types.list_type import ListType
from .......commons.types.map_type import MapType
from .......commons.types.variable_type import VariableType
from .deep_equality_correctness_check import DeepEqualityCorrectnessCheck
from .void_function_definition_that_takes_actual_result import VoidFunctionDefinitionThatTakesActualResult


class AssertCorrectnessCheck_DeepEquality(DeepEqualityCorrectnessCheck):
    type: typing_extensions.Literal["deepEquality"]

    class Config:
        frozen = True
        smart_union = True
        allow_population_by_field_name = True


class AssertCorrectnessCheck_Custom(VoidFunctionDefinitionThatTakesActualResult):
    type: typing_extensions.Literal["custom"]

    class Config:
        frozen = True
        smart_union = True
        allow_population_by_field_name = True


AssertCorrectnessCheck = typing.Union[AssertCorrectnessCheck_DeepEquality, AssertCorrectnessCheck_Custom]
AssertCorrectnessCheck_Custom.update_forward_refs(ListType=ListType, MapType=MapType, VariableType=VariableType)
