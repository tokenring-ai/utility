export default function joinDefault<OtherReturnType>(
	separator: string,
	iterable: Iterable<string> | null | undefined,
	defaultValue: OtherReturnType = "" as OtherReturnType,
) {
	if (iterable) {
		const values = Array.from(iterable);
		if (values.length > 0) return values.join(separator);
	}
	return defaultValue;
}
