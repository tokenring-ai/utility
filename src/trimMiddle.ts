export default function trimMiddle(
	str: string,
	startLength: number,
	endLength: number,
) {
	str = str.trim();
	if (str.length <= startLength + endLength + 13) {
		return str;
	}

	return str.slice(0, startLength) + "...omitted..." + str.slice(-endLength);
}
