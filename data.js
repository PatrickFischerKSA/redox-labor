export const lessons = [
  {
    id: 'transfer', title: 'Elektronenübergabe', kicker: 'ETAPPE 1 · GRUNDIDEE',
    intro: 'Redoxreaktionen koppeln immer eine Elektronenabgabe an eine Elektronenaufnahme.',
    concept: `<h3>Ein Elektron wechselt den Besitzer</h3><p>Das Natriumatom gibt sein Valenzelektron an Chlor ab. Natrium wird dabei oxidiert, Chlor reduziert. Die Teilgleichungen zeigen den Elektronenweg.</p><p class="equation">Ox: 2 Na → 2 Na⁺ + 2 e⁻<br>Red: Cl₂ + 2 e⁻ → 2 Cl⁻<br>Gesamt: 2 Na + Cl₂ → 2 NaCl</p><p><strong>Merke:</strong> Oxidation und Reduktion treten stets gemeinsam auf.</p>`
  },
  {
    id: 'agents', title: 'Mittel & Rollen', kicker: 'ETAPPE 2 · BEGRIFFE',
    intro: 'Wer Elektronen abgibt, verändert nicht nur sich selbst, sondern bewirkt die Reduktion des Partners.',
    concept: `<h3>Die Wirkung benennt das Mittel</h3><div class="concept-grid"><div><strong>Reduktionsmittel</strong><p>gibt Elektronen ab, reduziert den Partner und wird selbst oxidiert.</p></div><div><strong>Oxidationsmittel</strong><p>nimmt Elektronen auf, oxidiert den Partner und wird selbst reduziert.</p></div></div><p>Bei 2 Mg + O₂ → 2 MgO ist Mg das Reduktionsmittel und O₂ das Oxidationsmittel.</p>`
  },
  {
    id: 'numbers', title: 'Oxidationszahlen', kicker: 'ETAPPE 3 · SPURENSUCHE',
    intro: 'Oxidationszahlen machen Elektronenverschiebungen auch in Molekülen und mehratomigen Ionen sichtbar.',
    concept: `<h3>Regeln mit Priorität</h3><p>Elementarstoffe haben OZ 0. Einatomige Ionen tragen ihre Ionenladung als OZ. Fluor hat in Verbindungen −I, Sauerstoff meist −II und Wasserstoff meist +I. Die Summe entspricht der Gesamtladung des Teilchens.</p><p class="equation">H₂O: 2 · (+I) + (−II) = 0<br>SO₄²⁻: (+VI) + 4 · (−II) = −II</p><p>Eine Änderung der Oxidationszahl zeigt eine Redoxreaktion an.</p>`
  },
  {
    id: 'halves', title: 'Teilgleichungen', kicker: 'ETAPPE 4 · BILANZ',
    intro: 'Saubere Teilgleichungen zeigen, wie viele Elektronen abgegeben und aufgenommen werden.',
    concept: `<h3>Ladung und Stoffmenge stimmen</h3><p>Schreibe Oxidation und Reduktion getrennt. Multipliziere sie so, dass gleich viele Elektronen vorkommen. Addiere anschliessend und kürze die Elektronen.</p><p class="equation">Al → Al³⁺ + 3 e⁻ &nbsp; (×2)<br>Br₂ + 2 e⁻ → 2 Br⁻ &nbsp; (×3)<br>2 Al + 3 Br₂ → 2 AlBr₃</p>`
  },
  {
    id: 'series', title: 'Redoxreihe', kicker: 'ETAPPE 5 · RICHTUNG',
    intro: 'Standardpotentiale vergleichen das Bestreben von Redoxpaaren, reduziert zu werden.',
    concept: `<h3>Potentiale sagen die Richtung voraus</h3><p>Je positiver das Standardreduktionspotential E°, desto stärker ist die oxidierte Form als Oxidationsmittel. Je negativer E°, desto stärker ist die reduzierte Form als Reduktionsmittel.</p><p class="equation">Mg (−2,37 V) &lt; Zn (−0,76 V) &lt; Fe (−0,44 V) &lt; H₂ (0,00 V) &lt; Cu (+0,34 V) &lt; Ag (+0,80 V)</p><p>Damit gilt für die Reduktionsmittelstärke der Metalle: Mg &gt; Zn &gt; Fe &gt; Cu &gt; Ag.</p>`
  },
  {
    id: 'transferlab', title: 'Transfer-Labor', kicker: 'ETAPPE 6 · ANWENDUNG',
    intro: 'Jetzt verbindest du Teilchenliste, Rollen, Elektronenbilanz und Reaktionsrichtung.',
    concept: `<h3>Rezept für eine vollständige Lösung</h3><ol><li>Vorhandene Teilchen notieren.</li><li>Stärkstes Reduktionsmittel identifizieren und Oxidation formulieren.</li><li>Stärkstes Oxidationsmittel identifizieren und Reduktion formulieren.</li><li>Elektronenbilanz ausgleichen.</li><li>Ionen- und Stoffgleichung aufstellen.</li><li>Spontane Reaktionsrichtung prüfen.</li></ol>`
  }
];

export const questions = [
  {id:'t1', lesson:'transfer', level:1, type:'single', prompt:'Was geschieht bei einer Oxidation?', options:['Ein Teilchen nimmt Protonen auf.','Ein Teilchen gibt Elektronen ab.','Ein Teilchen nimmt Elektronen auf.','Die Oxidationszahl sinkt immer.'], answer:1, hint:['Denke an „Oxidation = Abgabe“.','Achte auf das übertragene Teilchen: e⁻.'], explain:'Bei einer Oxidation gibt ein Teilchen Elektronen ab. Seine Oxidationszahl steigt.'},
  {id:'t2', lesson:'transfer', level:1, type:'single', prompt:'Welches Teilchen wird bei Na → Na⁺ + e⁻ oxidiert?', options:['Na','Na⁺','e⁻','Keines'], answer:0, hint:['Betrachte die linke Seite der Teilgleichung.'], explain:'Das neutrale Natriumatom Na gibt ein Elektron ab und wird deshalb oxidiert.'},
  {id:'t3', lesson:'transfer', level:2, type:'multi', prompt:'Welche Aussagen zur Reaktion 2 Na + Cl₂ → 2 NaCl sind richtig?', options:['Na gibt Elektronen ab.','Cl₂ wird oxidiert.','Chlor nimmt Elektronen auf.','Oxidation und Reduktion laufen unabhängig voneinander.'], answer:[0,2], hint:['Verfolge die Elektronen von Na zu Cl.','Eine Redoxreaktion koppelt beide Teilvorgänge.'], explain:'Na wird oxidiert und Chlor reduziert. Beide Teilreaktionen sind über die übertragenen Elektronen gekoppelt.'},
  {id:'t4', lesson:'transfer', level:2, type:'text', prompt:'Ergänze die Reduktion von Chlor: Cl₂ + __ e⁻ → 2 Cl⁻', answers:['2','2e','2 e'], hint:['Auf der Produktseite entstehen zwei einfach negativ geladene Ionen.'], explain:'Zwei Chloratome nehmen je ein Elektron auf. Daher werden insgesamt 2 e⁻ benötigt.'},
  {id:'t5', lesson:'transfer', level:3, type:'single', prompt:'Welche Aussage erklärt am besten, warum es keine isolierte Oxidation gibt?', options:['Elektronen verschwinden nach der Abgabe.','Abgegebene Elektronen müssen von einem anderen Teilchen aufgenommen werden.','Jede Oxidation benötigt Sauerstoff.','Nur Metalle können oxidiert werden.'], answer:1, hint:['Ladung und Elektronen müssen erhalten bleiben.'], explain:'Elektronen werden übertragen, nicht vernichtet. Jede Abgabe braucht daher eine gleichzeitige Aufnahme.'},

  {id:'a1', lesson:'agents', level:1, type:'single', prompt:'Magnesium reagiert mit Sauerstoff. Welche Rolle hat Mg?', options:['Oxidationsmittel','Reduktionsmittel','Katalysator','Zuschauerion'], answer:1, hint:['Mg gibt Elektronen ab. Welche Wirkung hat es damit auf O₂?'], explain:'Mg gibt Elektronen ab, reduziert damit Sauerstoff und ist das Reduktionsmittel.'},
  {id:'a2', lesson:'agents', level:1, type:'single', prompt:'Ein Oxidationsmittel wird während der Reaktion selbst …', options:['oxidiert','reduziert','neutralisiert','nicht verändert'], answer:1, hint:['Das Mittel nimmt Elektronen vom Partner auf.'], explain:'Ein Oxidationsmittel nimmt Elektronen auf und wird dadurch selbst reduziert.'},
  {id:'a3', lesson:'agents', level:2, type:'multi', prompt:'Für Fe + Cu²⁺ → Fe²⁺ + Cu gilt:', options:['Fe ist Elektronendonator.','Cu²⁺ ist Reduktionsmittel.','Fe wird oxidiert.','Cu²⁺ wird oxidiert.'], answer:[0,2], hint:['Fe verliert zwei Elektronen; Cu²⁺ gewinnt sie.'], explain:'Fe gibt Elektronen ab und wird oxidiert. Es wirkt als Reduktionsmittel. Cu²⁺ nimmt Elektronen auf und ist das Oxidationsmittel.'},
  {id:'a4', lesson:'agents', level:2, type:'single', prompt:'Welche Kombination ist vollständig korrekt?', options:['Elektronenakzeptor – Reduktionsmittel – wird oxidiert','Elektronendonator – Reduktionsmittel – wird oxidiert','Elektronendonator – Oxidationsmittel – wird reduziert','Elektronenakzeptor – Reduktionsmittel – wird reduziert'], answer:1, hint:['Ein Reduktionsmittel ermöglicht die Reduktion des Partners durch Elektronenabgabe.'], explain:'Der Elektronendonator ist das Reduktionsmittel und wird selbst oxidiert.'},
  {id:'a5', lesson:'agents', level:3, type:'text', prompt:'Benenne das Oxidationsmittel in Zn + Cu²⁺ → Zn²⁺ + Cu (Formel genügt).', answers:['cu2+','cu²+','cu+2','cu(ii)','kupfer(ii)-ion','kupferion'], hint:['Gesucht ist das Teilchen, das Elektronen aufnimmt.'], explain:'Cu²⁺ nimmt zwei Elektronen auf und wird zu Cu reduziert. Es ist deshalb das Oxidationsmittel.'},

  {id:'n1', lesson:'numbers', level:1, type:'single', prompt:'Welche Oxidationszahl hat Fe im Elementarstoff Fe?', options:['−II','0','+II','+III'], answer:1, hint:['Für alle Elementarstoffe gilt dieselbe Grundregel.'], explain:'Atome in Elementarstoffen haben die Oxidationszahl 0.'},
  {id:'n2', lesson:'numbers', level:1, type:'single', prompt:'Welche Oxidationszahl hat Sauerstoff in CO₂?', options:['−II','−I','+II','+IV'], answer:0, hint:['Sauerstoff folgt in den meisten Verbindungen einer festen Regel.'], explain:'Sauerstoff hat in CO₂ die Oxidationszahl −II. Kohlenstoff muss daher +IV haben.'},
  {id:'n3', lesson:'numbers', level:2, type:'text', prompt:'Welche Oxidationszahl hat Stickstoff in HNO₂? Gib eine ganze Zahl mit Vorzeichen ein.', answers:['+3','3','+iii','iii'], hint:['Die Summe im neutralen Molekül ist 0. H hat +I, jedes O −II.','Rechne: +1 + x + 2·(−2) = 0.'], explain:'Es gilt +1 + x − 4 = 0. Daher besitzt N die Oxidationszahl +III.'},
  {id:'n4', lesson:'numbers', level:2, type:'text', prompt:'Welche Oxidationszahl hat Schwefel im Sulfat-Ion SO₄²⁻?', answers:['+6','6','+vi','vi'], hint:['Die Summe muss −2 ergeben. Vier O-Atome liefern zusammen −8.'], explain:'x + 4·(−2) = −2, also x = +6. Schwefel hat +VI.'},
  {id:'n5', lesson:'numbers', level:2, type:'multi', prompt:'Welche Aussagen zu Oxidationszahlen stimmen?', options:['Bei einatomigen Ionen entsprechen sie der Ionenladung.','Sie sind in Molekülen immer echte Ladungen.','Ihre Summe entspricht der Gesamtladung des Teilchens.','In Br₂ hat Br die Oxidationszahl −I.'], answer:[0,2], hint:['Unterscheide formale Rechengrösse und echte Ladung.','Br₂ ist ein Elementarstoff.'], explain:'Bei einatomigen Ionen entspricht die OZ der Ladung. In Molekülen ist sie formal; ihre Summe entspricht der Gesamtladung. In Br₂ ist sie 0.'},
  {id:'n6', lesson:'numbers', level:3, type:'single', prompt:'Wo hat Wasserstoff ausnahmsweise die Oxidationszahl −I?', options:['H₂O','HCl','NaH','HNO₂'], answer:2, hint:['Die Ausnahme tritt in Metallhydriden auf.'], explain:'In Natriumhydrid NaH liegt Wasserstoff als Hydrid vor und hat die Oxidationszahl −I.'},
  {id:'n7', lesson:'numbers', level:3, type:'text', prompt:'Welche Oxidationszahl hat Kohlenstoff in CH₃COOH im Mittel?', answers:['0','null'], hint:['Das neutrale Molekül enthält 2 C, 4 H mit +I und 2 O mit −II.'], explain:'2x + 4·(+1) + 2·(−2) = 0 ergibt x = 0. Die beiden C-Atome haben einzeln unterschiedliche OZ; der Mittelwert ist 0.'},

  {id:'h1', lesson:'halves', level:1, type:'single', prompt:'Welche Teilgleichung beschreibt die Oxidation von Zink korrekt?', options:['Zn + 2 e⁻ → Zn²⁺','Zn → Zn²⁺ + 2 e⁻','Zn²⁺ → Zn + 2 e⁻','Zn → Zn⁺ + 2 e⁻'], answer:1, hint:['Bei der Oxidation stehen die abgegebenen Elektronen rechts.'], explain:'Zink gibt zwei Elektronen ab: Zn → Zn²⁺ + 2 e⁻.'},
  {id:'h2', lesson:'halves', level:1, type:'text', prompt:'Wie viele Elektronen nimmt Cu²⁺ bei der Reduktion zu Cu auf?', answers:['2','2e','2 e'], hint:['Vergleiche die Ladung vor und nach der Reaktion.'], explain:'Cu²⁺ muss zwei Elektronen aufnehmen, um elektrisch neutral zu werden.'},
  {id:'h3', lesson:'halves', level:2, type:'single', prompt:'Welche Faktoren gleichen die Elektronen in Al → Al³⁺ + 3e⁻ und Br₂ + 2e⁻ → 2Br⁻ aus?', options:['Oxidation ×2, Reduktion ×3','Oxidation ×3, Reduktion ×2','Beide ×2','Beide ×3'], answer:0, hint:['Suche das kleinste gemeinsame Vielfache von 3 und 2.'], explain:'Das kgV ist 6. Zwei Aluminiumatome geben 6 e⁻ ab; drei Brommoleküle nehmen 6 e⁻ auf.'},
  {id:'h4', lesson:'halves', level:2, type:'text', prompt:'Ergänze den Koeffizienten: __ Al + 3 Br₂ → 2 AlBr₃', answers:['2'], hint:['Zähle die Aluminiumatome auf der Produktseite.'], explain:'Auf der Produktseite stehen in 2 AlBr₃ genau 2 Al-Atome. Der Koeffizient ist 2.'},
  {id:'h5', lesson:'halves', level:3, type:'multi', prompt:'Welche Kriterien erfüllt eine korrekt addierte Redoxgleichung?', options:['Gleiche Atomanzahl auf beiden Seiten','Gleiche Gesamtladung auf beiden Seiten','Elektronen stehen in der Gesamtgleichung','Abgegebene und aufgenommene Elektronen sind gleich zahlreich'], answer:[0,1,3], hint:['Elektronen werden beim Addieren der Teilgleichungen gekürzt.'], explain:'Masse und Ladung müssen erhalten sein. Die Elektronenzahlen müssen sich entsprechen und kürzen sich aus der Gesamtgleichung.'},
  {id:'h6', lesson:'halves', level:3, type:'text', prompt:'Gib die kleinsten Koeffizienten für __ Mg + __ O₂ → __ MgO als drei Zahlen ein.', answers:['2 1 2','2,1,2','2;1;2'], hint:['Gleiche zuerst die zwei Sauerstoffatome aus.'], explain:'Die ausgeglichene Stoffgleichung lautet 2 Mg + O₂ → 2 MgO.'},

  {id:'s1', lesson:'series', level:1, type:'sort', prompt:'Ordne die Metalle vom stärksten zum schwächsten Reduktionsmittel.', items:['Ag','Fe','Mg','Cu','Zn'], answer:['Mg','Zn','Fe','Cu','Ag'], hint:['Je negativer E°, desto stärker das Metall als Reduktionsmittel.'], explain:'Die korrekte Reihenfolge lautet Mg > Zn > Fe > Cu > Ag.'},
  {id:'s2', lesson:'series', level:1, type:'single', prompt:'Was bedeutet ein stark positives Standardreduktionspotential?', options:['Die oxidierte Form nimmt Elektronen besonders leicht auf.','Das Metall gibt Elektronen besonders leicht ab.','Es findet nie eine Redoxreaktion statt.','Das Redoxpaar ist ungeladen.'], answer:0, hint:['E° ist als Reduktionspotential definiert.'], explain:'Ein positives E° kennzeichnet ein starkes Bestreben der oxidierten Form, Elektronen aufzunehmen.'},
  {id:'s3', lesson:'series', level:2, type:'single', prompt:'Welche Reaktion läuft unter Standardbedingungen spontan ab?', options:['Cu + Zn²⁺ → Cu²⁺ + Zn','Zn + Cu²⁺ → Zn²⁺ + Cu','Ag + Cu²⁺ → Ag⁺ + Cu','Cu + Mg²⁺ → Cu²⁺ + Mg'], answer:1, hint:['Zn ist das stärkere Reduktionsmittel; Cu²⁺ das stärkere Oxidationsmittel.'], explain:'Zn gibt Elektronen an Cu²⁺ ab. E°Zelle = +0,34 − (−0,76) = +1,10 V, also ist die Reaktion spontan.'},
  {id:'s4', lesson:'series', level:2, type:'single', prompt:'Ein Kupferblech steht in ZnSO₄-Lösung. Welche Beobachtung ist zu erwarten?', options:['Ein Zinkbelag entsteht.','Kupfer löst sich vollständig.','Keine spontane Redoxreaktion.','Sauerstoff entsteht.'], answer:2, hint:['Cu ist als Reduktionsmittel schwächer als Zn.'], explain:'Cu kann Zn²⁺ nicht spontan reduzieren. Es entsteht kein Zinkbelag.'},
  {id:'s5', lesson:'series', level:3, type:'text', prompt:'Berechne E°Zelle für Zn + Cu²⁺ → Zn²⁺ + Cu in Volt. E°(Cu²⁺/Cu)=+0,34 V; E°(Zn²⁺/Zn)=−0,76 V.', answers:['1.10','1,10','1.1','1,1','+1.10','+1,10'], hint:['E°Zelle = E°Kathode − E°Anode.','Rechne +0,34 − (−0,76).'], explain:'E°Zelle = +0,34 V − (−0,76 V) = +1,10 V. Das positive Vorzeichen bestätigt die spontane Richtung.'},

  {id:'x1', lesson:'transferlab', level:1, type:'multi', prompt:'Welche Ionen sind vor der Reaktion eines Eisennagels mit Kupfer(II)-sulfat-Lösung vorhanden?', options:['Fe²⁺','Cu²⁺','SO₄²⁻','Cu'], answer:[1,2], hint:['Zerlege das gelöste Salz CuSO₄ in seine Ionen.'], explain:'In der Lösung liegen vor der Reaktion Cu²⁺ und SO₄²⁻ vor. Eisen ist als Metall vorhanden.'},
  {id:'x2', lesson:'transferlab', level:2, type:'single', prompt:'Beim Eisennagel in CuSO₄-Lösung entsteht ein roter Belag. Woraus besteht er?', options:['Eisen(II)-sulfat','Kupfermetall','Kupfer(II)-oxid','Rost'], answer:1, hint:['Cu²⁺ nimmt Elektronen auf.'], explain:'Cu²⁺ wird zu elementarem Kupfer reduziert. Das abgeschiedene Kupfer bildet den roten Belag.'},
  {id:'x3', lesson:'transferlab', level:2, type:'text', prompt:'Gib die Ionenreaktion für Eisen mit Cu²⁺ an. Leerzeichen und Aggregatzustände sind optional.', answers:['fe+cu2+->fe2++cu','fe + cu2+ -> fe2+ + cu','cu2++fe->cu+fe2+','cu2+ + fe -> cu + fe2+'], hint:['Kombiniere Fe → Fe²⁺ + 2e⁻ mit Cu²⁺ + 2e⁻ → Cu.'], explain:'Die Ionenreaktion lautet Fe + Cu²⁺ → Fe²⁺ + Cu. Sulfat ist ein Zuschauerion.'},
  {id:'x4', lesson:'transferlab', level:2, type:'single', prompt:'Lithium wird in NaCl-Lösung gegeben. Welche Aussage berücksichtigt die wässrige Lösung korrekt?', options:['Li reduziert sicher Na⁺ zu Na.','Li reagiert bevorzugt mit Wasser; elementares Na entsteht nicht.','Es geschieht gar nichts.','Chlorid wird zu Chlor oxidiert.'], answer:1, hint:['In einer wässrigen Lösung ist auch H₂O ein möglicher Reaktionspartner.'], explain:'Lithium reagiert heftig mit Wasser zu Lithiumhydroxid und Wasserstoff. In Wasser wird Na⁺ nicht zu Natrium abgeschieden.'},
  {id:'x5', lesson:'transferlab', level:3, type:'single', prompt:'Ist 2 H₂ + O₂ → 2 H₂O eine Redoxreaktion?', options:['Nein, weil keine Ionen vorkommen.','Nein, weil Wasser neutral ist.','Ja: H steigt von 0 auf +I, O sinkt von 0 auf −II.','Ja: Beide Elemente werden oxidiert.'], answer:2, hint:['Vergleiche die Oxidationszahlen in den Elementarstoffen und im Wasser.'], explain:'H wird oxidiert (0 → +I), O reduziert (0 → −II). Damit liegt eine Redoxreaktion vor.'},
  {id:'x6', lesson:'transferlab', level:3, type:'single', prompt:'Welche vollständige Deutung passt zu 2 Al + 3 Br₂ → 2 AlBr₃?', options:['Al wird reduziert; Br₂ ist Reduktionsmittel.','Al wird oxidiert und ist Reduktionsmittel; Br₂ wird reduziert und ist Oxidationsmittel.','Al und Br₂ werden beide oxidiert.','Die Oxidationszahlen ändern sich nicht.'], answer:1, hint:['Al: 0 → +III; Br: 0 → −I.'], explain:'Al gibt Elektronen ab und wirkt als Reduktionsmittel. Brom nimmt sie auf und wirkt als Oxidationsmittel.'}
];

export const diagnostic = [
  {prompt:'Oxidation bedeutet …', options:['Elektronenabgabe','Elektronenaufnahme','Protonenabgabe'], answer:0},
  {prompt:'Die Oxidationszahl von O in H₂O ist …', options:['0','−II','+II'], answer:1},
  {prompt:'In Fe + Cu²⁺ → Fe²⁺ + Cu ist das Oxidationsmittel …', options:['Fe','Cu²⁺','Fe²⁺'], answer:1},
  {prompt:'Die stärkste Reduktionsmittel-Reihenfolge ist …', options:['Ag > Cu > Fe > Zn > Mg','Mg > Zn > Fe > Cu > Ag','Cu > Ag > Mg > Fe > Zn'], answer:1}
];

export const glossary = [
  ['Elektronendonator','Teilchen, das Elektronen abgibt. Es wird oxidiert und wirkt als Reduktionsmittel.'],
  ['Elektronenakzeptor','Teilchen, das Elektronen aufnimmt. Es wird reduziert und wirkt als Oxidationsmittel.'],
  ['Oxidation','Abgabe von Elektronen; dabei steigt die Oxidationszahl.'],
  ['Reduktion','Aufnahme von Elektronen; dabei sinkt die Oxidationszahl.'],
  ['Redoxreaktion','Elektronenübertragungsreaktion, bei der Oxidation und Reduktion gekoppelt ablaufen.'],
  ['Oxidationsmittel','Elektronenakzeptor, der den Partner oxidiert und selbst reduziert wird.'],
  ['Reduktionsmittel','Elektronendonator, der den Partner reduziert und selbst oxidiert wird.'],
  ['Oxidationszahl','Formale Ladungszahl zur Verfolgung von Elektronenverschiebungen.'],
  ['Standardpotential E°','Potential eines Redoxpaares relativ zur Standard-Wasserstoffelektrode unter Standardbedingungen.'],
  ['Zuschauerion','Ion, das in der Lösung vorhanden ist, aber an der eigentlichen Redoxreaktion nicht teilnimmt.']
];
