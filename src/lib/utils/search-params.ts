/**
 * @description Gets a comma separated query paramter as an array.
 * @example
 * ["foo", "bar", "baz"] === getQueryParamArray(new URLSearchParams("?q=foo,bar,baz"), "q")
 */
export function getQueryParamArray(
	instance: URLSearchParams,
	key: string
): string[] {
	const paramValue = instance.get(key);
	if (paramValue) {
		return paramValue.split(",");
	}

	return [];
}

/**
 * @description Sets a query parameter to a comma separated list of values.
 * @example
 * "?q=foo,bar,baz" === addQueryParamArray(new URLSearchParams(), "q", "foo", "bar", "baz")
 * "?foo=1,2,3"     === addQueryParamArray(new URLSearchParams("?foo=1,2"), 'foo', 3)
 */
export function addQueryParamArray(
	instance: URLSearchParams,
	key: string,
	...values: unknown[]
): void {
	const existingValues = getQueryParamArray(instance, key);
	const newValues = [...existingValues, ...values];
	instance.set(key, newValues.join(","));
}
