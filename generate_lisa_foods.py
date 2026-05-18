import json
import re

data = {
  "happy": [
    {
      "cat": "Getreide, Pseudogetreide, Stärkehaltiges",
      "items": ["Amaranth", "Buchweizen", "Fonio", "Guarkernmehl (E 412)", "Hafer (glutenfrei)", "Hirse", "Kichererbse", "Linse", "Mais", "Quinoa", "Reis", "Tapioka", "Teff"]
    },
    {
      "cat": "Hülsenfrüchte",
      "items": ["Bohne (grün/dick)", "Erbse", "Kichererbse", "Linse", "Mungobohne"]
    },
    {
      "cat": "Nüsse & Samen",
      "items": ["Cashewkerne", "Esskastanie", "Hagebutte", "Kokosnuss", "Kürbiskerne", "Macadamia", "Paranuss", "Pekannuss", "Pinienkerne", "Pistazie"]
    },
    {
      "cat": "Wurzel- & Knollengemüse",
      "items": ["Karotte", "Kartoffel", "Kürbis/Kerne", "Maniok", "Pastinake", "Rote Beete", "Sellerieknolle", "Süßkartoffel"]
    },
    {
      "cat": "Pilze",
      "items": ["Austernspilz", "Champignon", "Maronen-Röhrling", "Pfifferling"]
    },
    {
      "cat": "Blattgemüse",
      "items": ["Artischocke", "Chinakohl", "Chicorée", "Endivie", "Eisbergsalat", "Feldsalat", "Gartenkresse", "Kopfsalat", "Lollo Rosso", "Löwenzahn", "Mangold", "Radicchio", "Romanasalat", "Rucola", "Weinblätter"]
    },
    {
      "cat": "Zwiebelgemüse",
      "items": ["Bärlauch", "Bleichsellerie", "Fenchel", "Knoblauch", "Lauch", "Pastinake", "Rote Beete", "Sellerieknolle", "Steckrübe", "Topinambur", "Zwiebel"]
    },
    {
      "cat": "Kohlgemüse",
      "items": ["Blumenkohl", "Brokkoli", "Grünkohl", "Kohlrabi", "Radieschen", "Rotkohl", "Rosenkohl", "Weißkohl", "Wirsing"]
    },
    {
      "cat": "Fruchtgemüse",
      "items": ["Gurke", "Kürbis", "Muskatkürbis", "Okraschote", "Oliven", "Paprikaschote", "Spargel", "Zucchini"]
    },
    {
      "cat": "Kern- und Steinobst",
      "items": ["Apfel", "Aprikose", "Birne", "Dattel", "Feige", "Guave", "Kaktusfeige", "Kirsche", "Litschi", "Mango", "Mirabelle", "Nektarine", "Pfirsich", "Pflaume", "Quitte"]
    },
    {
      "cat": "Beeren & Melone",
      "items": ["Blaubeere", "Heidelbeere", "Brombeere", "Cranberry", "Granatapfel", "Honigmelone", "Johannisbeere", "Preiselbeere", "Sanddorn", "Stachelbeere", "Traube", "Rosine", "Wassermelone"]
    },
    {
      "cat": "Milchprodukte",
      "items": ["Halloumi", "Hellim", "Kamelmilch", "Kefir (Kuh)", "Milch (Kuh, gekocht)", "Schafsmilch", "Schafskäse", "Stutenmilch", "Ziegenmilch", "Ziegenkäse"]
    },
    {
      "cat": "Süßungsmittel",
      "items": ["Agavendicksaft", "Ahornsirup", "Carob-Pulver", "Dattelsirup", "Honig", "Rohrzucker", "Vanille"]
    },
    {
      "cat": "Fleisch & Wild",
      "items": ["Ente", "Gans", "Hase", "Hirsch", "Huhn", "Kalb", "Kaninchen", "Lamm", "Reh", "Rind", "Strauß", "Truthahn", "Pute", "Wachtel", "Wildschwein", "Ziege"]
    },
    {
      "cat": "Fisch & Meeresfrüchte",
      "items": ["Aal", "Blaualge: Spirulina", "Dorade", "Forelle", "Hai", "Heilbutt", "Hering", "Kabeljau", "Karpfen", "Lachs", "Pangasius", "Red Snapper", "Rotalge: Nori", "Rotbarsch", "Schellfisch", "Scholle", "Schwertfisch", "See-/Wolfsbarsch", "Seehecht", "Seelachs", "Seezunge", "Seeteufel", "Zander"]
    },
    {
      "cat": "Sonstiges & Spezial",
      "items": ["Alfalfa", "Aloe Vera", "Bambussprossen", "Kapern", "Zitronenmelisse"]
    },
    {
      "cat": "Kräuter & Gewürze",
      "items": ["Anis", "Basilikum", "Bohnenkraut", "Chilli Cayenne", "Chilli Jalapeno", "Dill", "Estragon", "Gartenkresse", "Kardamom", "Kerbel", "Koriander", "Kreuzkümmel", "Kümmel", "Lavendel", "Liebstöckel", "Lorbeerblatt", "Majoran", "Mohn", "Muskat", "Muskatnuss", "Nelke", "Oregano", "Petersilie", "Piment", "Pfeffer (schwarz/weiß)", "Pfefferminze", "Rosmarin", "Salbei", "Safran", "Salz", "Senfkorn", "Selleriegrün", "Thymian", "Wacholder", "Zimt"]
    },
    {
      "cat": "Verdickungsmittel",
      "items": ["Agar-Agar (E 406)", "Guarkernmehl (E 412)", "Kurkumin (E 100)", "Pektin (E 440)", "Tragant (E 413)", "Xanthan (E 415)"]
    },
    {
      "cat": "Getränke / Extrakte",
      "items": ["Kamille", "Mohn", "Tee (grün)", "Tee (schwarz)", "Rotbusch", "Rooibos", "Sanddorn"]
    }
  ],
  "no_go": [
    {
      "cat": "Das gar nicht",
      "items": ["Gluten", "Dinkel", "Gerste", "Roggen", "Weizen", "Leinsamen", "Kamut", "Kaffee", "Ingwer", "Milch (Kuh)", "Ricotte (Kuh)", "Hühnereidotter", "Hühnereiweiß", "Wachtelei", "Gänseei", "Sonnenblumenkern", "Sonnenblumenöl", "Mandel", "Haselnuss", "Erdnuss"]
    }
  ]
}

aliases = {
"Gluten": ["glutenhaltiges getreide", "glutenhaltig"],
"Weizen": ["weizenmehl", "weizenstärke", "weizengluten", "hartweizen", "weizengrieß", "weizenkleber"],
"Dinkel": ["dinkelmehl", "dinkelflocken"],
"Gerste": ["gerstenmalz", "gerstenmalzextrakt", "gerstenflocken"],
"Roggen": ["roggenmehl", "roggenvollkornmehl"],
"Kamut": ["khorasan-weizen", "khorasan"],
"Milch (Kuh)": ["kuhmilch", "milch", "magermilchpulver", "vollmilchpulver", "milchpulver", "molke", "molkenpulver", "milcheiweiß", "milchprotein", "sahne", "butter", "rahm"],
"Ricotte (Kuh)": ["ricotta", "ricotta kuhmilch", "ricotta aus kuhmilch"],
"Hühnereidotter": ["eigelb", "hühnereigelb", "eidotter"],
"Hühnereiweiß": ["eiweiß", "eiweiss", "eiklar", "hühnereiweiss", "hühnereiweiß", "albumin"],
"Wachtelei": ["wachteleier"],
"Gänseei": ["gänseeier"],
"Sonnenblumenkern": ["sonnenblumenkerne"],
"Sonnenblumenöl": ["sonnenblumenoel", "sunflower oil"],
"Mandel": ["mandeln", "mandelmehl", "mandelmus", "mandelprotein"],
"Haselnuss": ["haselnüsse", "haselnuesse", "haselnussmus", "haselnussmark"],
"Erdnuss": ["erdnüsse", "erdnuesse", "erdnussbutter", "erdnussöl", "erdnussoel", "peanut", "peanuts"],
"Kaffee": ["coffee", "koffein", "coffein"],
"Halloumi": ["hellim"],
"Blaubeere": ["heidelbeere", "heidelbeeren", "blaubeeren"],
"Traube": ["weintraube", "weintrauben", "rosine", "rosinen"],
"Ziegenkäse": ["ziegenmilchkäse"],
"Schafskäse": ["schafmilchkäse"],
"Rotbusch": ["rooibos", "rotbuschtee"],
"Tee (grün)": ["grüner tee", "gruen tee", "green tea"],
"Tee (schwarz)": ["schwarzer tee", "black tea"],
"Agar-Agar (E 406)": ["agar agar", "e406"],
"Guarkernmehl (E 412)": ["guarkernmehl", "e412"],
"Kurkumin (E 100)": ["curcumin", "kurkumaextrakt", "e100"],
"Pektin (E 440)": ["pektin", "e440"],
"Tragant (E 413)": ["e413"],
"Xanthan (E 415)": ["xantan", "e415"]
}

def make_id(status, name):
    clean = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-')
    return f"lisa-{status}-{clean}"

with open('lib/lisa/lisaFoods.ts', 'w') as f:
    f.write("import { LisaFoodItem } from './types';\n\n")
    f.write("export const predefinedLisaFoods: LisaFoodItem[] = [\n")
    
    cats = []
    
    for cat_data in data["no_go"]:
        cat = cat_data["cat"]
        cats.append(cat)
        for item in cat_data["items"]:
            id_val = make_id("nogo", item)
            als = aliases.get(item, [])
            als_str = json.dumps(als, ensure_ascii=False)
            f.write(f"  {{\n    id: '{id_val}',\n    name: '{item}',\n    category: '{cat}',\n    status: 'no_go',\n    aliases: {als_str},\n  }},\n")
            
    for cat_data in data["happy"]:
        cat = cat_data["cat"]
        cats.append(cat)
        for item in cat_data["items"]:
            id_val = make_id("happy", item)
            als = aliases.get(item, [])
            als_str = json.dumps(als, ensure_ascii=False)
            f.write(f"  {{\n    id: '{id_val}',\n    name: '{item}',\n    category: '{cat}',\n    status: 'happy',\n    aliases: {als_str},\n  }},\n")
            
    f.write("];\n\n")
    
    f.write("export const lisaCategories = [\n")
    for c in cats:
        f.write(f"  '{c}',\n")
    f.write("];\n")
