export type AnswerRule =
  | { type: 'single'; answer: number }
  | { type: 'multi'; answer: number[] }
  | { type: 'text'; answers: string[] }
  | { type: 'sort'; answer: string[] };

export const answers: Record<string, AnswerRule> = {
  t1:{type:'single',answer:1}, t2:{type:'single',answer:0}, t3:{type:'multi',answer:[0,2]}, t4:{type:'text',answers:['2','2e','2 e']}, t5:{type:'single',answer:1},
  a1:{type:'single',answer:1}, a2:{type:'single',answer:1}, a3:{type:'multi',answer:[0,2]}, a4:{type:'single',answer:1}, a5:{type:'text',answers:['cu2+','cu²+','cu+2','cu(ii)','kupfer(ii)-ion','kupferion']},
  n1:{type:'single',answer:1}, n2:{type:'single',answer:0}, n3:{type:'text',answers:['+3','3','+iii','iii']}, n4:{type:'text',answers:['+6','6','+vi','vi']}, n5:{type:'multi',answer:[0,2]}, n6:{type:'single',answer:2}, n7:{type:'text',answers:['0','null']},
  h1:{type:'single',answer:1}, h2:{type:'text',answers:['2','2e','2 e']}, h3:{type:'single',answer:0}, h4:{type:'text',answers:['2']}, h5:{type:'multi',answer:[0,1,3]}, h6:{type:'text',answers:['2 1 2','2,1,2','2;1;2']},
  s1:{type:'sort',answer:['Mg','Zn','Fe','Cu','Ag']}, s2:{type:'single',answer:0}, s3:{type:'single',answer:1}, s4:{type:'single',answer:2}, s5:{type:'text',answers:['1.10','1,10','1.1','1,1','+1.10','+1,10']},
  x1:{type:'multi',answer:[1,2]}, x2:{type:'single',answer:1}, x3:{type:'text',answers:['fe+cu2+->fe2++cu','fe + cu2+ -> fe2+ + cu','cu2++fe->cu+fe2+','cu2+ + fe -> cu + fe2+']}, x4:{type:'single',answer:1}, x5:{type:'single',answer:2}, x6:{type:'single',answer:1}
};

function normalize(value: string): string {
  return value.toLowerCase().trim()
    .replaceAll('−','-').replaceAll('–','-').replaceAll('→','->')
    .replaceAll('²','2').replaceAll('³','3').replaceAll('⁺','+').replaceAll('⁻','-')
    .replace(/\s+/g,' ').replace(/\s*([+;,])\s*/g,'$1').replace(/\s*->\s*/g,'->');
}

export function scoreAnswer(rule: AnswerRule, response: unknown): number {
  if (rule.type === 'single') {
    return Array.isArray(response) && response.length === 1 && response[0] === rule.answer ? 1 : 0;
  }
  if (rule.type === 'multi') {
    if (!Array.isArray(response) || response.some(value => !Number.isInteger(value))) return 0;
    const unique = [...new Set(response as number[])];
    if (!unique.length) return 0;
    const correctHits = unique.filter(value => rule.answer.includes(value)).length;
    const wrongHits = unique.filter(value => !rule.answer.includes(value)).length;
    return Math.max(0, Math.min(1, (correctHits - wrongHits * 0.5) / rule.answer.length));
  }
  if (rule.type === 'text') {
    return typeof response === 'string' && rule.answers.some(answer => normalize(answer) === normalize(response)) ? 1 : 0;
  }
  if (!Array.isArray(response) || response.length !== rule.answer.length || response.some(value => typeof value !== 'string')) return 0;
  const positions = response.reduce((sum, item, index) => sum + (item === rule.answer[index] ? 1 : 0), 0);
  return positions / rule.answer.length;
}

export const diagnosticAnswers = [0, 1, 1, 1] as const;
