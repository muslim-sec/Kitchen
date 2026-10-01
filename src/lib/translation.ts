export async function translateText(text: string, targetLang: string = 'en'): Promise<string> {
	if (!text) return text;
	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
			text
		)}`;
		const res = await fetch(url);
		const data = await res.json();
		return data[0][0][0] || text;
	} catch (e) {
		console.error('Translation failed:', e);
		return text;
	}
}
