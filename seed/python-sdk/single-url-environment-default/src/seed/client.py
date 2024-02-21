# This file was auto-generated by Fern from our API Definition.

import typing

import httpx

from .core.client_wrapper import AsyncClientWrapper, SyncClientWrapper
from .environment import SeedSingleUrlEnvironmentDefaultEnvironment
from .resources.dummy.client import AsyncDummyClient, DummyClient


class SeedSingleUrlEnvironmentDefault:
    """
    Use this class to access the different functions within the SDK. You can instantiate any number of clients with different configuration that will propogate to these functions.

    Parameters:
        - base_url: typing.Optional[str]. The base url to use for requests from the client.

        - environment: SeedSingleUrlEnvironmentDefaultEnvironment. The environment to use for requests from the client. from .environment import SeedSingleUrlEnvironmentDefaultEnvironment

                                                                   Defaults to SeedSingleUrlEnvironmentDefaultEnvironment.PRODUCTION

        - token: typing.Union[str, typing.Callable[[], str]].

        - timeout: typing.Optional[float]. The timeout to be used, in seconds, for requests by default the timeout is 60 seconds.

        - httpx_client: typing.Optional[httpx.Client]. The httpx client to use for making requests, a preconfigured client is used by default, however this is useful should you want to pass in any custom httpx configuration.
    ---
    from seed.client import SeedSingleUrlEnvironmentDefault

    client = SeedSingleUrlEnvironmentDefault(
        token="YOUR_TOKEN",
    )
    """

    def __init__(
        self,
        *,
        base_url: typing.Optional[str] = None,
        environment: SeedSingleUrlEnvironmentDefaultEnvironment = SeedSingleUrlEnvironmentDefaultEnvironment.PRODUCTION,
        token: typing.Union[str, typing.Callable[[], str]],
        timeout: typing.Optional[float] = 60,
        httpx_client: typing.Optional[httpx.Client] = None
    ):
        self._client_wrapper = SyncClientWrapper(
            base_url=_get_base_url(base_url=base_url, environment=environment),
            token=token,
            httpx_client=httpx.Client(timeout=timeout) if httpx_client is None else httpx_client,
        )
        self.dummy = DummyClient(client_wrapper=self._client_wrapper)


class AsyncSeedSingleUrlEnvironmentDefault:
    """
    Use this class to access the different functions within the SDK. You can instantiate any number of clients with different configuration that will propogate to these functions.

    Parameters:
        - base_url: typing.Optional[str]. The base url to use for requests from the client.

        - environment: SeedSingleUrlEnvironmentDefaultEnvironment. The environment to use for requests from the client. from .environment import SeedSingleUrlEnvironmentDefaultEnvironment

                                                                   Defaults to SeedSingleUrlEnvironmentDefaultEnvironment.PRODUCTION

        - token: typing.Union[str, typing.Callable[[], str]].

        - timeout: typing.Optional[float]. The timeout to be used, in seconds, for requests by default the timeout is 60 seconds.

        - httpx_client: typing.Optional[httpx.AsyncClient]. The httpx client to use for making requests, a preconfigured client is used by default, however this is useful should you want to pass in any custom httpx configuration.
    ---
    from seed.client import AsyncSeedSingleUrlEnvironmentDefault

    client = AsyncSeedSingleUrlEnvironmentDefault(
        token="YOUR_TOKEN",
    )
    """

    def __init__(
        self,
        *,
        base_url: typing.Optional[str] = None,
        environment: SeedSingleUrlEnvironmentDefaultEnvironment = SeedSingleUrlEnvironmentDefaultEnvironment.PRODUCTION,
        token: typing.Union[str, typing.Callable[[], str]],
        timeout: typing.Optional[float] = 60,
        httpx_client: typing.Optional[httpx.AsyncClient] = None
    ):
        self._client_wrapper = AsyncClientWrapper(
            base_url=_get_base_url(base_url=base_url, environment=environment),
            token=token,
            httpx_client=httpx.AsyncClient(timeout=timeout) if httpx_client is None else httpx_client,
        )
        self.dummy = AsyncDummyClient(client_wrapper=self._client_wrapper)


def _get_base_url(
    *, base_url: typing.Optional[str] = None, environment: SeedSingleUrlEnvironmentDefaultEnvironment
) -> str:
    if base_url is not None:
        return base_url
    elif environment is not None:
        return environment.value
    else:
        raise Exception("Please pass in either base_url or environment to construct the client")
