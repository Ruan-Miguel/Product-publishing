
export default function treatAccents (words: string): string {
  words = words.replace(/a|[à-å]/gi, '(?:a|[à-å])')

  words = words.replace(/e|[è-ë]/gi, '(?:e|[è-ë])')

  words = words.replace(/i|[ì-ï]/gi, '(?:i|[ì-ï])')

  words = words.replace(/o|[ò-ö]/gi, '(?:o|[ò-ö])')

  words = words.replace(/u|[ù-ü]/gi, '(?:u|[ù-ü])')

  words = words.replace(/c|ç/gi, '(?:c|ç)')

  return words
}
