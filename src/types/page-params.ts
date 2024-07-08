export type UnknownRecord = Record<string, string | undefined>;

export type PageParams<
	TRouteParams = UnknownRecord,
	TSearchParams = UnknownRecord
> = RouteParams<TRouteParams> & SearchParams<TSearchParams>;

export type RouteParams<TRouteParams = UnknownRecord> = {
	params: TRouteParams;
};

export type SearchParams<TSearchParams = UnknownRecord> = {
	searchParams: TSearchParams;
};
