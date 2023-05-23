// src/encoding-he.ts
var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var regexAsciiWhitelist = /[\x01-\x7F]/g;
var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
var encodeMap = {
  "\xAD": "shy",
  "\u200C": "zwnj",
  "\u200D": "zwj",
  "\u200E": "lrm",
  "\u2063": "ic",
  "\u2062": "it",
  "\u2061": "af",
  "\u200F": "rlm",
  "\u200B": "ZeroWidthSpace",
  "\u2060": "NoBreak",
  "\u0311": "DownBreve",
  "\u20DB": "tdot",
  "\u20DC": "DotDot",
  "	": "Tab",
  "\n": "NewLine",
  "\u2008": "puncsp",
  "\u205F": "MediumSpace",
  "\u2009": "thinsp",
  "\u200A": "hairsp",
  "\u2004": "emsp13",
  "\u2002": "ensp",
  "\u2005": "emsp14",
  "\u2003": "emsp",
  "\u2007": "numsp",
  "\xA0": "nbsp",
  "\u205F\u200A": "ThickSpace",
  "\u203E": "oline",
  _: "lowbar",
  "\u2010": "dash",
  "\u2013": "ndash",
  "\u2014": "mdash",
  "\u2015": "horbar",
  ",": "comma",
  ";": "semi",
  "\u204F": "bsemi",
  ":": "colon",
  "\u2A74": "Colone",
  "!": "excl",
  "\xA1": "iexcl",
  "?": "quest",
  "\xBF": "iquest",
  ".": "period",
  "\u2025": "nldr",
  "\u2026": "mldr",
  "\xB7": "middot",
  "'": "apos",
  "\u2018": "lsquo",
  "\u2019": "rsquo",
  "\u201A": "sbquo",
  "\u2039": "lsaquo",
  "\u203A": "rsaquo",
  '"': "quot",
  "\u201C": "ldquo",
  "\u201D": "rdquo",
  "\u201E": "bdquo",
  "\xAB": "laquo",
  "\xBB": "raquo",
  "(": "lpar",
  ")": "rpar",
  "[": "lsqb",
  "]": "rsqb",
  "{": "lcub",
  "}": "rcub",
  "\u2308": "lceil",
  "\u2309": "rceil",
  "\u230A": "lfloor",
  "\u230B": "rfloor",
  "\u2985": "lopar",
  "\u2986": "ropar",
  "\u298B": "lbrke",
  "\u298C": "rbrke",
  "\u298D": "lbrkslu",
  "\u298E": "rbrksld",
  "\u298F": "lbrksld",
  "\u2990": "rbrkslu",
  "\u2991": "langd",
  "\u2992": "rangd",
  "\u2993": "lparlt",
  "\u2994": "rpargt",
  "\u2995": "gtlPar",
  "\u2996": "ltrPar",
  "\u27E6": "lobrk",
  "\u27E7": "robrk",
  "\u27E8": "lang",
  "\u27E9": "rang",
  "\u27EA": "Lang",
  "\u27EB": "Rang",
  "\u27EC": "loang",
  "\u27ED": "roang",
  "\u2772": "lbbrk",
  "\u2773": "rbbrk",
  "\u2016": "Vert",
  "\xA7": "sect",
  "\xB6": "para",
  "@": "commat",
  "*": "ast",
  "/": "sol",
  undefined: null,
  "&": "amp",
  "#": "num",
  "%": "percnt",
  "\u2030": "permil",
  "\u2031": "pertenk",
  "\u2020": "dagger",
  "\u2021": "Dagger",
  "\u2022": "bull",
  "\u2043": "hybull",
  "\u2032": "prime",
  "\u2033": "Prime",
  "\u2034": "tprime",
  "\u2057": "qprime",
  "\u2035": "bprime",
  "\u2041": "caret",
  "`": "grave",
  "\xB4": "acute",
  "\u02DC": "tilde",
  "^": "Hat",
  "\xAF": "macr",
  "\u02D8": "breve",
  "\u02D9": "dot",
  "\xA8": "die",
  "\u02DA": "ring",
  "\u02DD": "dblac",
  "\xB8": "cedil",
  "\u02DB": "ogon",
  "\u02C6": "circ",
  "\u02C7": "caron",
  "\xB0": "deg",
  "\xA9": "copy",
  "\xAE": "reg",
  "\u2117": "copysr",
  "\u2118": "wp",
  "\u211E": "rx",
  "\u2127": "mho",
  "\u2129": "iiota",
  "\u2190": "larr",
  "\u219A": "nlarr",
  "\u2192": "rarr",
  "\u219B": "nrarr",
  "\u2191": "uarr",
  "\u2193": "darr",
  "\u2194": "harr",
  "\u21AE": "nharr",
  "\u2195": "varr",
  "\u2196": "nwarr",
  "\u2197": "nearr",
  "\u2198": "searr",
  "\u2199": "swarr",
  "\u219D": "rarrw",
  "\u219D\u0338": "nrarrw",
  "\u219E": "Larr",
  "\u219F": "Uarr",
  "\u21A0": "Rarr",
  "\u21A1": "Darr",
  "\u21A2": "larrtl",
  "\u21A3": "rarrtl",
  "\u21A4": "mapstoleft",
  "\u21A5": "mapstoup",
  "\u21A6": "map",
  "\u21A7": "mapstodown",
  "\u21A9": "larrhk",
  "\u21AA": "rarrhk",
  "\u21AB": "larrlp",
  "\u21AC": "rarrlp",
  "\u21AD": "harrw",
  "\u21B0": "lsh",
  "\u21B1": "rsh",
  "\u21B2": "ldsh",
  "\u21B3": "rdsh",
  "\u21B5": "crarr",
  "\u21B6": "cularr",
  "\u21B7": "curarr",
  "\u21BA": "olarr",
  "\u21BB": "orarr",
  "\u21BC": "lharu",
  "\u21BD": "lhard",
  "\u21BE": "uharr",
  "\u21BF": "uharl",
  "\u21C0": "rharu",
  "\u21C1": "rhard",
  "\u21C2": "dharr",
  "\u21C3": "dharl",
  "\u21C4": "rlarr",
  "\u21C5": "udarr",
  "\u21C6": "lrarr",
  "\u21C7": "llarr",
  "\u21C8": "uuarr",
  "\u21C9": "rrarr",
  "\u21CA": "ddarr",
  "\u21CB": "lrhar",
  "\u21CC": "rlhar",
  "\u21D0": "lArr",
  "\u21CD": "nlArr",
  "\u21D1": "uArr",
  "\u21D2": "rArr",
  "\u21CF": "nrArr",
  "\u21D3": "dArr",
  "\u21D4": "iff",
  "\u21CE": "nhArr",
  "\u21D5": "vArr",
  "\u21D6": "nwArr",
  "\u21D7": "neArr",
  "\u21D8": "seArr",
  "\u21D9": "swArr",
  "\u21DA": "lAarr",
  "\u21DB": "rAarr",
  "\u21DD": "zigrarr",
  "\u21E4": "larrb",
  "\u21E5": "rarrb",
  "\u21F5": "duarr",
  "\u21FD": "loarr",
  "\u21FE": "roarr",
  "\u21FF": "hoarr",
  "\u2200": "forall",
  "\u2201": "comp",
  "\u2202": "part",
  "\u2202\u0338": "npart",
  "\u2203": "exist",
  "\u2204": "nexist",
  "\u2205": "empty",
  "\u2207": "Del",
  "\u2208": "in",
  "\u2209": "notin",
  "\u220B": "ni",
  "\u220C": "notni",
  "\u03F6": "bepsi",
  "\u220F": "prod",
  "\u2210": "coprod",
  "\u2211": "sum",
  "+": "plus",
  "\xB1": "pm",
  "\xF7": "div",
  "\xD7": "times",
  "<": "lt",
  "\u226E": "nlt",
  "<\u20D2": "nvlt",
  "=": "equals",
  "\u2260": "ne",
  "=\u20E5": "bne",
  "\u2A75": "Equal",
  ">": "gt",
  "\u226F": "ngt",
  ">\u20D2": "nvgt",
  "\xAC": "not",
  "|": "vert",
  "\xA6": "brvbar",
  "\u2212": "minus",
  "\u2213": "mp",
  "\u2214": "plusdo",
  "\u2044": "frasl",
  "\u2216": "setmn",
  "\u2217": "lowast",
  "\u2218": "compfn",
  "\u221A": "Sqrt",
  "\u221D": "prop",
  "\u221E": "infin",
  "\u221F": "angrt",
  "\u2220": "ang",
  "\u2220\u20D2": "nang",
  "\u2221": "angmsd",
  "\u2222": "angsph",
  "\u2223": "mid",
  "\u2224": "nmid",
  "\u2225": "par",
  "\u2226": "npar",
  "\u2227": "and",
  "\u2228": "or",
  "\u2229": "cap",
  "\u2229\uFE00": "caps",
  "\u222A": "cup",
  "\u222A\uFE00": "cups",
  "\u222B": "int",
  "\u222C": "Int",
  "\u222D": "tint",
  "\u2A0C": "qint",
  "\u222E": "oint",
  "\u222F": "Conint",
  "\u2230": "Cconint",
  "\u2231": "cwint",
  "\u2232": "cwconint",
  "\u2233": "awconint",
  "\u2234": "there4",
  "\u2235": "becaus",
  "\u2236": "ratio",
  "\u2237": "Colon",
  "\u2238": "minusd",
  "\u223A": "mDDot",
  "\u223B": "homtht",
  "\u223C": "sim",
  "\u2241": "nsim",
  "\u223C\u20D2": "nvsim",
  "\u223D": "bsim",
  "\u223D\u0331": "race",
  "\u223E": "ac",
  "\u223E\u0333": "acE",
  "\u223F": "acd",
  "\u2240": "wr",
  "\u2242": "esim",
  "\u2242\u0338": "nesim",
  "\u2243": "sime",
  "\u2244": "nsime",
  "\u2245": "cong",
  "\u2247": "ncong",
  "\u2246": "simne",
  "\u2248": "ap",
  "\u2249": "nap",
  "\u224A": "ape",
  "\u224B": "apid",
  "\u224B\u0338": "napid",
  "\u224C": "bcong",
  "\u224D": "CupCap",
  "\u226D": "NotCupCap",
  "\u224D\u20D2": "nvap",
  "\u224E": "bump",
  "\u224E\u0338": "nbump",
  "\u224F": "bumpe",
  "\u224F\u0338": "nbumpe",
  "\u2250": "doteq",
  "\u2250\u0338": "nedot",
  "\u2251": "eDot",
  "\u2252": "efDot",
  "\u2253": "erDot",
  "\u2254": "colone",
  "\u2255": "ecolon",
  "\u2256": "ecir",
  "\u2257": "cire",
  "\u2259": "wedgeq",
  "\u225A": "veeeq",
  "\u225C": "trie",
  "\u225F": "equest",
  "\u2261": "equiv",
  "\u2262": "nequiv",
  "\u2261\u20E5": "bnequiv",
  "\u2264": "le",
  "\u2270": "nle",
  "\u2264\u20D2": "nvle",
  "\u2265": "ge",
  "\u2271": "nge",
  "\u2265\u20D2": "nvge",
  "\u2266": "lE",
  "\u2266\u0338": "nlE",
  "\u2267": "gE",
  "\u2267\u0338": "ngE",
  "\u2268\uFE00": "lvnE",
  "\u2268": "lnE",
  "\u2269": "gnE",
  "\u2269\uFE00": "gvnE",
  "\u226A": "ll",
  "\u226A\u0338": "nLtv",
  "\u226A\u20D2": "nLt",
  "\u226B": "gg",
  "\u226B\u0338": "nGtv",
  "\u226B\u20D2": "nGt",
  "\u226C": "twixt",
  "\u2272": "lsim",
  "\u2274": "nlsim",
  "\u2273": "gsim",
  "\u2275": "ngsim",
  "\u2276": "lg",
  "\u2278": "ntlg",
  "\u2277": "gl",
  "\u2279": "ntgl",
  "\u227A": "pr",
  "\u2280": "npr",
  "\u227B": "sc",
  "\u2281": "nsc",
  "\u227C": "prcue",
  "\u22E0": "nprcue",
  "\u227D": "sccue",
  "\u22E1": "nsccue",
  "\u227E": "prsim",
  "\u227F": "scsim",
  "\u227F\u0338": "NotSucceedsTilde",
  "\u2282": "sub",
  "\u2284": "nsub",
  "\u2282\u20D2": "vnsub",
  "\u2283": "sup",
  "\u2285": "nsup",
  "\u2283\u20D2": "vnsup",
  "\u2286": "sube",
  "\u2288": "nsube",
  "\u2287": "supe",
  "\u2289": "nsupe",
  "\u228A\uFE00": "vsubne",
  "\u228A": "subne",
  "\u228B\uFE00": "vsupne",
  "\u228B": "supne",
  "\u228D": "cupdot",
  "\u228E": "uplus",
  "\u228F": "sqsub",
  "\u228F\u0338": "NotSquareSubset",
  "\u2290": "sqsup",
  "\u2290\u0338": "NotSquareSuperset",
  "\u2291": "sqsube",
  "\u22E2": "nsqsube",
  "\u2292": "sqsupe",
  "\u22E3": "nsqsupe",
  "\u2293": "sqcap",
  "\u2293\uFE00": "sqcaps",
  "\u2294": "sqcup",
  "\u2294\uFE00": "sqcups",
  "\u2295": "oplus",
  "\u2296": "ominus",
  "\u2297": "otimes",
  "\u2298": "osol",
  "\u2299": "odot",
  "\u229A": "ocir",
  "\u229B": "oast",
  "\u229D": "odash",
  "\u229E": "plusb",
  "\u229F": "minusb",
  "\u22A0": "timesb",
  "\u22A1": "sdotb",
  "\u22A2": "vdash",
  "\u22AC": "nvdash",
  "\u22A3": "dashv",
  "\u22A4": "top",
  "\u22A5": "bot",
  "\u22A7": "models",
  "\u22A8": "vDash",
  "\u22AD": "nvDash",
  "\u22A9": "Vdash",
  "\u22AE": "nVdash",
  "\u22AA": "Vvdash",
  "\u22AB": "VDash",
  "\u22AF": "nVDash",
  "\u22B0": "prurel",
  "\u22B2": "vltri",
  "\u22EA": "nltri",
  "\u22B3": "vrtri",
  "\u22EB": "nrtri",
  "\u22B4": "ltrie",
  "\u22EC": "nltrie",
  "\u22B4\u20D2": "nvltrie",
  "\u22B5": "rtrie",
  "\u22ED": "nrtrie",
  "\u22B5\u20D2": "nvrtrie",
  "\u22B6": "origof",
  "\u22B7": "imof",
  "\u22B8": "mumap",
  "\u22B9": "hercon",
  "\u22BA": "intcal",
  "\u22BB": "veebar",
  "\u22BD": "barvee",
  "\u22BE": "angrtvb",
  "\u22BF": "lrtri",
  "\u22C0": "Wedge",
  "\u22C1": "Vee",
  "\u22C2": "xcap",
  "\u22C3": "xcup",
  "\u22C4": "diam",
  "\u22C5": "sdot",
  "\u22C6": "Star",
  "\u22C7": "divonx",
  "\u22C8": "bowtie",
  "\u22C9": "ltimes",
  "\u22CA": "rtimes",
  "\u22CB": "lthree",
  "\u22CC": "rthree",
  "\u22CD": "bsime",
  "\u22CE": "cuvee",
  "\u22CF": "cuwed",
  "\u22D0": "Sub",
  "\u22D1": "Sup",
  "\u22D2": "Cap",
  "\u22D3": "Cup",
  "\u22D4": "fork",
  "\u22D5": "epar",
  "\u22D6": "ltdot",
  "\u22D7": "gtdot",
  "\u22D8": "Ll",
  "\u22D8\u0338": "nLl",
  "\u22D9": "Gg",
  "\u22D9\u0338": "nGg",
  "\u22DA\uFE00": "lesg",
  "\u22DA": "leg",
  "\u22DB": "gel",
  "\u22DB\uFE00": "gesl",
  "\u22DE": "cuepr",
  "\u22DF": "cuesc",
  "\u22E6": "lnsim",
  "\u22E7": "gnsim",
  "\u22E8": "prnsim",
  "\u22E9": "scnsim",
  "\u22EE": "vellip",
  "\u22EF": "ctdot",
  "\u22F0": "utdot",
  "\u22F1": "dtdot",
  "\u22F2": "disin",
  "\u22F3": "isinsv",
  "\u22F4": "isins",
  "\u22F5": "isindot",
  "\u22F5\u0338": "notindot",
  "\u22F6": "notinvc",
  "\u22F7": "notinvb",
  "\u22F9": "isinE",
  "\u22F9\u0338": "notinE",
  "\u22FA": "nisd",
  "\u22FB": "xnis",
  "\u22FC": "nis",
  "\u22FD": "notnivc",
  "\u22FE": "notnivb",
  "\u2305": "barwed",
  "\u2306": "Barwed",
  "\u230C": "drcrop",
  "\u230D": "dlcrop",
  "\u230E": "urcrop",
  "\u230F": "ulcrop",
  "\u2310": "bnot",
  "\u2312": "profline",
  "\u2313": "profsurf",
  "\u2315": "telrec",
  "\u2316": "target",
  "\u231C": "ulcorn",
  "\u231D": "urcorn",
  "\u231E": "dlcorn",
  "\u231F": "drcorn",
  "\u2322": "frown",
  "\u2323": "smile",
  "\u232D": "cylcty",
  "\u232E": "profalar",
  "\u2336": "topbot",
  "\u233D": "ovbar",
  "\u233F": "solbar",
  "\u237C": "angzarr",
  "\u23B0": "lmoust",
  "\u23B1": "rmoust",
  "\u23B4": "tbrk",
  "\u23B5": "bbrk",
  "\u23B6": "bbrktbrk",
  "\u23DC": "OverParenthesis",
  "\u23DD": "UnderParenthesis",
  "\u23DE": "OverBrace",
  "\u23DF": "UnderBrace",
  "\u23E2": "trpezium",
  "\u23E7": "elinters",
  "\u2423": "blank",
  "\u2500": "boxh",
  "\u2502": "boxv",
  "\u250C": "boxdr",
  "\u2510": "boxdl",
  "\u2514": "boxur",
  "\u2518": "boxul",
  "\u251C": "boxvr",
  "\u2524": "boxvl",
  "\u252C": "boxhd",
  "\u2534": "boxhu",
  "\u253C": "boxvh",
  "\u2550": "boxH",
  "\u2551": "boxV",
  "\u2552": "boxdR",
  "\u2553": "boxDr",
  "\u2554": "boxDR",
  "\u2555": "boxdL",
  "\u2556": "boxDl",
  "\u2557": "boxDL",
  "\u2558": "boxuR",
  "\u2559": "boxUr",
  "\u255A": "boxUR",
  "\u255B": "boxuL",
  "\u255C": "boxUl",
  "\u255D": "boxUL",
  "\u255E": "boxvR",
  "\u255F": "boxVr",
  "\u2560": "boxVR",
  "\u2561": "boxvL",
  "\u2562": "boxVl",
  "\u2563": "boxVL",
  "\u2564": "boxHd",
  "\u2565": "boxhD",
  "\u2566": "boxHD",
  "\u2567": "boxHu",
  "\u2568": "boxhU",
  "\u2569": "boxHU",
  "\u256A": "boxvH",
  "\u256B": "boxVh",
  "\u256C": "boxVH",
  "\u2580": "uhblk",
  "\u2584": "lhblk",
  "\u2588": "block",
  "\u2591": "blk14",
  "\u2592": "blk12",
  "\u2593": "blk34",
  "\u25A1": "squ",
  "\u25AA": "squf",
  "\u25AB": "EmptyVerySmallSquare",
  "\u25AD": "rect",
  "\u25AE": "marker",
  "\u25B1": "fltns",
  "\u25B3": "xutri",
  "\u25B4": "utrif",
  "\u25B5": "utri",
  "\u25B8": "rtrif",
  "\u25B9": "rtri",
  "\u25BD": "xdtri",
  "\u25BE": "dtrif",
  "\u25BF": "dtri",
  "\u25C2": "ltrif",
  "\u25C3": "ltri",
  "\u25CA": "loz",
  "\u25CB": "cir",
  "\u25EC": "tridot",
  "\u25EF": "xcirc",
  "\u25F8": "ultri",
  "\u25F9": "urtri",
  "\u25FA": "lltri",
  "\u25FB": "EmptySmallSquare",
  "\u25FC": "FilledSmallSquare",
  "\u2605": "starf",
  "\u2606": "star",
  "\u260E": "phone",
  "\u2640": "female",
  "\u2642": "male",
  "\u2660": "spades",
  "\u2663": "clubs",
  "\u2665": "hearts",
  "\u2666": "diams",
  "\u266A": "sung",
  "\u2713": "check",
  "\u2717": "cross",
  "\u2720": "malt",
  "\u2736": "sext",
  "\u2758": "VerticalSeparator",
  "\u27C8": "bsolhsub",
  "\u27C9": "suphsol",
  "\u27F5": "xlarr",
  "\u27F6": "xrarr",
  "\u27F7": "xharr",
  "\u27F8": "xlArr",
  "\u27F9": "xrArr",
  "\u27FA": "xhArr",
  "\u27FC": "xmap",
  "\u27FF": "dzigrarr",
  "\u2902": "nvlArr",
  "\u2903": "nvrArr",
  "\u2904": "nvHarr",
  "\u2905": "Map",
  "\u290C": "lbarr",
  "\u290D": "rbarr",
  "\u290E": "lBarr",
  "\u290F": "rBarr",
  "\u2910": "RBarr",
  "\u2911": "DDotrahd",
  "\u2912": "UpArrowBar",
  "\u2913": "DownArrowBar",
  "\u2916": "Rarrtl",
  "\u2919": "latail",
  "\u291A": "ratail",
  "\u291B": "lAtail",
  "\u291C": "rAtail",
  "\u291D": "larrfs",
  "\u291E": "rarrfs",
  "\u291F": "larrbfs",
  "\u2920": "rarrbfs",
  "\u2923": "nwarhk",
  "\u2924": "nearhk",
  "\u2925": "searhk",
  "\u2926": "swarhk",
  "\u2927": "nwnear",
  "\u2928": "toea",
  "\u2929": "tosa",
  "\u292A": "swnwar",
  "\u2933": "rarrc",
  "\u2933\u0338": "nrarrc",
  "\u2935": "cudarrr",
  "\u2936": "ldca",
  "\u2937": "rdca",
  "\u2938": "cudarrl",
  "\u2939": "larrpl",
  "\u293C": "curarrm",
  "\u293D": "cularrp",
  "\u2945": "rarrpl",
  "\u2948": "harrcir",
  "\u2949": "Uarrocir",
  "\u294A": "lurdshar",
  "\u294B": "ldrushar",
  "\u294E": "LeftRightVector",
  "\u294F": "RightUpDownVector",
  "\u2950": "DownLeftRightVector",
  "\u2951": "LeftUpDownVector",
  "\u2952": "LeftVectorBar",
  "\u2953": "RightVectorBar",
  "\u2954": "RightUpVectorBar",
  "\u2955": "RightDownVectorBar",
  "\u2956": "DownLeftVectorBar",
  "\u2957": "DownRightVectorBar",
  "\u2958": "LeftUpVectorBar",
  "\u2959": "LeftDownVectorBar",
  "\u295A": "LeftTeeVector",
  "\u295B": "RightTeeVector",
  "\u295C": "RightUpTeeVector",
  "\u295D": "RightDownTeeVector",
  "\u295E": "DownLeftTeeVector",
  "\u295F": "DownRightTeeVector",
  "\u2960": "LeftUpTeeVector",
  "\u2961": "LeftDownTeeVector",
  "\u2962": "lHar",
  "\u2963": "uHar",
  "\u2964": "rHar",
  "\u2965": "dHar",
  "\u2966": "luruhar",
  "\u2967": "ldrdhar",
  "\u2968": "ruluhar",
  "\u2969": "rdldhar",
  "\u296A": "lharul",
  "\u296B": "llhard",
  "\u296C": "rharul",
  "\u296D": "lrhard",
  "\u296E": "udhar",
  "\u296F": "duhar",
  "\u2970": "RoundImplies",
  "\u2971": "erarr",
  "\u2972": "simrarr",
  "\u2973": "larrsim",
  "\u2974": "rarrsim",
  "\u2975": "rarrap",
  "\u2976": "ltlarr",
  "\u2978": "gtrarr",
  "\u2979": "subrarr",
  "\u297B": "suplarr",
  "\u297C": "lfisht",
  "\u297D": "rfisht",
  "\u297E": "ufisht",
  "\u297F": "dfisht",
  "\u299A": "vzigzag",
  "\u299C": "vangrt",
  "\u299D": "angrtvbd",
  "\u29A4": "ange",
  "\u29A5": "range",
  "\u29A6": "dwangle",
  "\u29A7": "uwangle",
  "\u29A8": "angmsdaa",
  "\u29A9": "angmsdab",
  "\u29AA": "angmsdac",
  "\u29AB": "angmsdad",
  "\u29AC": "angmsdae",
  "\u29AD": "angmsdaf",
  "\u29AE": "angmsdag",
  "\u29AF": "angmsdah",
  "\u29B0": "bemptyv",
  "\u29B1": "demptyv",
  "\u29B2": "cemptyv",
  "\u29B3": "raemptyv",
  "\u29B4": "laemptyv",
  "\u29B5": "ohbar",
  "\u29B6": "omid",
  "\u29B7": "opar",
  "\u29B9": "operp",
  "\u29BB": "olcross",
  "\u29BC": "odsold",
  "\u29BE": "olcir",
  "\u29BF": "ofcir",
  "\u29C0": "olt",
  "\u29C1": "ogt",
  "\u29C2": "cirscir",
  "\u29C3": "cirE",
  "\u29C4": "solb",
  "\u29C5": "bsolb",
  "\u29C9": "boxbox",
  "\u29CD": "trisb",
  "\u29CE": "rtriltri",
  "\u29CF": "LeftTriangleBar",
  "\u29CF\u0338": "NotLeftTriangleBar",
  "\u29D0": "RightTriangleBar",
  "\u29D0\u0338": "NotRightTriangleBar",
  "\u29DC": "iinfin",
  "\u29DD": "infintie",
  "\u29DE": "nvinfin",
  "\u29E3": "eparsl",
  "\u29E4": "smeparsl",
  "\u29E5": "eqvparsl",
  "\u29EB": "lozf",
  "\u29F4": "RuleDelayed",
  "\u29F6": "dsol",
  "\u2A00": "xodot",
  "\u2A01": "xoplus",
  "\u2A02": "xotime",
  "\u2A04": "xuplus",
  "\u2A06": "xsqcup",
  "\u2A0D": "fpartint",
  "\u2A10": "cirfnint",
  "\u2A11": "awint",
  "\u2A12": "rppolint",
  "\u2A13": "scpolint",
  "\u2A14": "npolint",
  "\u2A15": "pointint",
  "\u2A16": "quatint",
  "\u2A17": "intlarhk",
  "\u2A22": "pluscir",
  "\u2A23": "plusacir",
  "\u2A24": "simplus",
  "\u2A25": "plusdu",
  "\u2A26": "plussim",
  "\u2A27": "plustwo",
  "\u2A29": "mcomma",
  "\u2A2A": "minusdu",
  "\u2A2D": "loplus",
  "\u2A2E": "roplus",
  "\u2A2F": "Cross",
  "\u2A30": "timesd",
  "\u2A31": "timesbar",
  "\u2A33": "smashp",
  "\u2A34": "lotimes",
  "\u2A35": "rotimes",
  "\u2A36": "otimesas",
  "\u2A37": "Otimes",
  "\u2A38": "odiv",
  "\u2A39": "triplus",
  "\u2A3A": "triminus",
  "\u2A3B": "tritime",
  "\u2A3C": "iprod",
  "\u2A3F": "amalg",
  "\u2A40": "capdot",
  "\u2A42": "ncup",
  "\u2A43": "ncap",
  "\u2A44": "capand",
  "\u2A45": "cupor",
  "\u2A46": "cupcap",
  "\u2A47": "capcup",
  "\u2A48": "cupbrcap",
  "\u2A49": "capbrcup",
  "\u2A4A": "cupcup",
  "\u2A4B": "capcap",
  "\u2A4C": "ccups",
  "\u2A4D": "ccaps",
  "\u2A50": "ccupssm",
  "\u2A53": "And",
  "\u2A54": "Or",
  "\u2A55": "andand",
  "\u2A56": "oror",
  "\u2A57": "orslope",
  "\u2A58": "andslope",
  "\u2A5A": "andv",
  "\u2A5B": "orv",
  "\u2A5C": "andd",
  "\u2A5D": "ord",
  "\u2A5F": "wedbar",
  "\u2A66": "sdote",
  "\u2A6A": "simdot",
  "\u2A6D": "congdot",
  "\u2A6D\u0338": "ncongdot",
  "\u2A6E": "easter",
  "\u2A6F": "apacir",
  "\u2A70": "apE",
  "\u2A70\u0338": "napE",
  "\u2A71": "eplus",
  "\u2A72": "pluse",
  "\u2A73": "Esim",
  "\u2A77": "eDDot",
  "\u2A78": "equivDD",
  "\u2A79": "ltcir",
  "\u2A7A": "gtcir",
  "\u2A7B": "ltquest",
  "\u2A7C": "gtquest",
  "\u2A7D": "les",
  "\u2A7D\u0338": "nles",
  "\u2A7E": "ges",
  "\u2A7E\u0338": "nges",
  "\u2A7F": "lesdot",
  "\u2A80": "gesdot",
  "\u2A81": "lesdoto",
  "\u2A82": "gesdoto",
  "\u2A83": "lesdotor",
  "\u2A84": "gesdotol",
  "\u2A85": "lap",
  "\u2A86": "gap",
  "\u2A87": "lne",
  "\u2A88": "gne",
  "\u2A89": "lnap",
  "\u2A8A": "gnap",
  "\u2A8B": "lEg",
  "\u2A8C": "gEl",
  "\u2A8D": "lsime",
  "\u2A8E": "gsime",
  "\u2A8F": "lsimg",
  "\u2A90": "gsiml",
  "\u2A91": "lgE",
  "\u2A92": "glE",
  "\u2A93": "lesges",
  "\u2A94": "gesles",
  "\u2A95": "els",
  "\u2A96": "egs",
  "\u2A97": "elsdot",
  "\u2A98": "egsdot",
  "\u2A99": "el",
  "\u2A9A": "eg",
  "\u2A9D": "siml",
  "\u2A9E": "simg",
  "\u2A9F": "simlE",
  "\u2AA0": "simgE",
  "\u2AA1": "LessLess",
  "\u2AA1\u0338": "NotNestedLessLess",
  "\u2AA2": "GreaterGreater",
  "\u2AA2\u0338": "NotNestedGreaterGreater",
  "\u2AA4": "glj",
  "\u2AA5": "gla",
  "\u2AA6": "ltcc",
  "\u2AA7": "gtcc",
  "\u2AA8": "lescc",
  "\u2AA9": "gescc",
  "\u2AAA": "smt",
  "\u2AAB": "lat",
  "\u2AAC": "smte",
  "\u2AAC\uFE00": "smtes",
  "\u2AAD": "late",
  "\u2AAD\uFE00": "lates",
  "\u2AAE": "bumpE",
  "\u2AAF": "pre",
  "\u2AAF\u0338": "npre",
  "\u2AB0": "sce",
  "\u2AB0\u0338": "nsce",
  "\u2AB3": "prE",
  "\u2AB4": "scE",
  "\u2AB5": "prnE",
  "\u2AB6": "scnE",
  "\u2AB7": "prap",
  "\u2AB8": "scap",
  "\u2AB9": "prnap",
  "\u2ABA": "scnap",
  "\u2ABB": "Pr",
  "\u2ABC": "Sc",
  "\u2ABD": "subdot",
  "\u2ABE": "supdot",
  "\u2ABF": "subplus",
  "\u2AC0": "supplus",
  "\u2AC1": "submult",
  "\u2AC2": "supmult",
  "\u2AC3": "subedot",
  "\u2AC4": "supedot",
  "\u2AC5": "subE",
  "\u2AC5\u0338": "nsubE",
  "\u2AC6": "supE",
  "\u2AC6\u0338": "nsupE",
  "\u2AC7": "subsim",
  "\u2AC8": "supsim",
  "\u2ACB\uFE00": "vsubnE",
  "\u2ACB": "subnE",
  "\u2ACC\uFE00": "vsupnE",
  "\u2ACC": "supnE",
  "\u2ACF": "csub",
  "\u2AD0": "csup",
  "\u2AD1": "csube",
  "\u2AD2": "csupe",
  "\u2AD3": "subsup",
  "\u2AD4": "supsub",
  "\u2AD5": "subsub",
  "\u2AD6": "supsup",
  "\u2AD7": "suphsub",
  "\u2AD8": "supdsub",
  "\u2AD9": "forkv",
  "\u2ADA": "topfork",
  "\u2ADB": "mlcp",
  "\u2AE4": "Dashv",
  "\u2AE6": "Vdashl",
  "\u2AE7": "Barv",
  "\u2AE8": "vBar",
  "\u2AE9": "vBarv",
  "\u2AEB": "Vbar",
  "\u2AEC": "Not",
  "\u2AED": "bNot",
  "\u2AEE": "rnmid",
  "\u2AEF": "cirmid",
  "\u2AF0": "midcir",
  "\u2AF1": "topcir",
  "\u2AF2": "nhpar",
  "\u2AF3": "parsim",
  "\u2AFD": "parsl",
  "\u2AFD\u20E5": "nparsl",
  "\u266D": "flat",
  "\u266E": "natur",
  "\u266F": "sharp",
  "\xA4": "curren",
  "\xA2": "cent",
  $: "dollar",
  "\xA3": "pound",
  "\xA5": "yen",
  "\u20AC": "euro",
  "\xB9": "sup1",
  "\xBD": "half",
  "\u2153": "frac13",
  "\xBC": "frac14",
  "\u2155": "frac15",
  "\u2159": "frac16",
  "\u215B": "frac18",
  "\xB2": "sup2",
  "\u2154": "frac23",
  "\u2156": "frac25",
  "\xB3": "sup3",
  "\xBE": "frac34",
  "\u2157": "frac35",
  "\u215C": "frac38",
  "\u2158": "frac45",
  "\u215A": "frac56",
  "\u215D": "frac58",
  "\u215E": "frac78",
  "\u{1D4B6}": "ascr",
  "\u{1D552}": "aopf",
  "\u{1D51E}": "afr",
  "\u{1D538}": "Aopf",
  "\u{1D504}": "Afr",
  "\u{1D49C}": "Ascr",
  "\xAA": "ordf",
  "\xE1": "aacute",
  "\xC1": "Aacute",
  "\xE0": "agrave",
  "\xC0": "Agrave",
  "\u0103": "abreve",
  "\u0102": "Abreve",
  "\xE2": "acirc",
  "\xC2": "Acirc",
  "\xE5": "aring",
  "\xC5": "angst",
  "\xE4": "auml",
  "\xC4": "Auml",
  "\xE3": "atilde",
  "\xC3": "Atilde",
  "\u0105": "aogon",
  "\u0104": "Aogon",
  "\u0101": "amacr",
  "\u0100": "Amacr",
  "\xE6": "aelig",
  "\xC6": "AElig",
  "\u{1D4B7}": "bscr",
  "\u{1D553}": "bopf",
  "\u{1D51F}": "bfr",
  "\u{1D539}": "Bopf",
  "\u212C": "Bscr",
  "\u{1D505}": "Bfr",
  "\u{1D520}": "cfr",
  "\u{1D4B8}": "cscr",
  "\u{1D554}": "copf",
  "\u212D": "Cfr",
  "\u{1D49E}": "Cscr",
  "\u2102": "Copf",
  "\u0107": "cacute",
  "\u0106": "Cacute",
  "\u0109": "ccirc",
  "\u0108": "Ccirc",
  "\u010D": "ccaron",
  "\u010C": "Ccaron",
  "\u010B": "cdot",
  "\u010A": "Cdot",
  "\xE7": "ccedil",
  "\xC7": "Ccedil",
  "\u2105": "incare",
  "\u{1D521}": "dfr",
  "\u2146": "dd",
  "\u{1D555}": "dopf",
  "\u{1D4B9}": "dscr",
  "\u{1D49F}": "Dscr",
  "\u{1D507}": "Dfr",
  "\u2145": "DD",
  "\u{1D53B}": "Dopf",
  "\u010F": "dcaron",
  "\u010E": "Dcaron",
  "\u0111": "dstrok",
  "\u0110": "Dstrok",
  "\xF0": "eth",
  "\xD0": "ETH",
  "\u2147": "ee",
  "\u212F": "escr",
  "\u{1D522}": "efr",
  "\u{1D556}": "eopf",
  "\u2130": "Escr",
  "\u{1D508}": "Efr",
  "\u{1D53C}": "Eopf",
  "\xE9": "eacute",
  "\xC9": "Eacute",
  "\xE8": "egrave",
  "\xC8": "Egrave",
  "\xEA": "ecirc",
  "\xCA": "Ecirc",
  "\u011B": "ecaron",
  "\u011A": "Ecaron",
  "\xEB": "euml",
  "\xCB": "Euml",
  "\u0117": "edot",
  "\u0116": "Edot",
  "\u0119": "eogon",
  "\u0118": "Eogon",
  "\u0113": "emacr",
  "\u0112": "Emacr",
  "\u{1D523}": "ffr",
  "\u{1D557}": "fopf",
  "\u{1D4BB}": "fscr",
  "\u{1D509}": "Ffr",
  "\u{1D53D}": "Fopf",
  "\u2131": "Fscr",
  "\uFB00": "fflig",
  "\uFB03": "ffilig",
  "\uFB04": "ffllig",
  "\uFB01": "filig",
  fj: "fjlig",
  "\uFB02": "fllig",
  "\u0192": "fnof",
  "\u210A": "gscr",
  "\u{1D558}": "gopf",
  "\u{1D524}": "gfr",
  "\u{1D4A2}": "Gscr",
  "\u{1D53E}": "Gopf",
  "\u{1D50A}": "Gfr",
  "\u01F5": "gacute",
  "\u011F": "gbreve",
  "\u011E": "Gbreve",
  "\u011D": "gcirc",
  "\u011C": "Gcirc",
  "\u0121": "gdot",
  "\u0120": "Gdot",
  "\u0122": "Gcedil",
  "\u{1D525}": "hfr",
  "\u210E": "planckh",
  "\u{1D4BD}": "hscr",
  "\u{1D559}": "hopf",
  "\u210B": "Hscr",
  "\u210C": "Hfr",
  "\u210D": "Hopf",
  "\u0125": "hcirc",
  "\u0124": "Hcirc",
  "\u210F": "hbar",
  "\u0127": "hstrok",
  "\u0126": "Hstrok",
  "\u{1D55A}": "iopf",
  "\u{1D526}": "ifr",
  "\u{1D4BE}": "iscr",
  "\u2148": "ii",
  "\u{1D540}": "Iopf",
  "\u2110": "Iscr",
  "\u2111": "Im",
  "\xED": "iacute",
  "\xCD": "Iacute",
  "\xEC": "igrave",
  "\xCC": "Igrave",
  "\xEE": "icirc",
  "\xCE": "Icirc",
  "\xEF": "iuml",
  "\xCF": "Iuml",
  "\u0129": "itilde",
  "\u0128": "Itilde",
  "\u0130": "Idot",
  "\u012F": "iogon",
  "\u012E": "Iogon",
  "\u012B": "imacr",
  "\u012A": "Imacr",
  "\u0133": "ijlig",
  "\u0132": "IJlig",
  "\u0131": "imath",
  "\u{1D4BF}": "jscr",
  "\u{1D55B}": "jopf",
  "\u{1D527}": "jfr",
  "\u{1D4A5}": "Jscr",
  "\u{1D50D}": "Jfr",
  "\u{1D541}": "Jopf",
  "\u0135": "jcirc",
  "\u0134": "Jcirc",
  "\u0237": "jmath",
  "\u{1D55C}": "kopf",
  "\u{1D4C0}": "kscr",
  "\u{1D528}": "kfr",
  "\u{1D4A6}": "Kscr",
  "\u{1D542}": "Kopf",
  "\u{1D50E}": "Kfr",
  "\u0137": "kcedil",
  "\u0136": "Kcedil",
  "\u{1D529}": "lfr",
  "\u{1D4C1}": "lscr",
  "\u2113": "ell",
  "\u{1D55D}": "lopf",
  "\u2112": "Lscr",
  "\u{1D50F}": "Lfr",
  "\u{1D543}": "Lopf",
  "\u013A": "lacute",
  "\u0139": "Lacute",
  "\u013E": "lcaron",
  "\u013D": "Lcaron",
  "\u013C": "lcedil",
  "\u013B": "Lcedil",
  "\u0142": "lstrok",
  "\u0141": "Lstrok",
  "\u0140": "lmidot",
  "\u013F": "Lmidot",
  "\u{1D52A}": "mfr",
  "\u{1D55E}": "mopf",
  "\u{1D4C2}": "mscr",
  "\u{1D510}": "Mfr",
  "\u{1D544}": "Mopf",
  "\u2133": "Mscr",
  "\u{1D52B}": "nfr",
  "\u{1D55F}": "nopf",
  "\u{1D4C3}": "nscr",
  "\u2115": "Nopf",
  "\u{1D4A9}": "Nscr",
  "\u{1D511}": "Nfr",
  "\u0144": "nacute",
  "\u0143": "Nacute",
  "\u0148": "ncaron",
  "\u0147": "Ncaron",
  "\xF1": "ntilde",
  "\xD1": "Ntilde",
  "\u0146": "ncedil",
  "\u0145": "Ncedil",
  "\u2116": "numero",
  "\u014B": "eng",
  "\u014A": "ENG",
  "\u{1D560}": "oopf",
  "\u{1D52C}": "ofr",
  "\u2134": "oscr",
  "\u{1D4AA}": "Oscr",
  "\u{1D512}": "Ofr",
  "\u{1D546}": "Oopf",
  "\xBA": "ordm",
  "\xF3": "oacute",
  "\xD3": "Oacute",
  "\xF2": "ograve",
  "\xD2": "Ograve",
  "\xF4": "ocirc",
  "\xD4": "Ocirc",
  "\xF6": "ouml",
  "\xD6": "Ouml",
  "\u0151": "odblac",
  "\u0150": "Odblac",
  "\xF5": "otilde",
  "\xD5": "Otilde",
  "\xF8": "oslash",
  "\xD8": "Oslash",
  "\u014D": "omacr",
  "\u014C": "Omacr",
  "\u0153": "oelig",
  "\u0152": "OElig",
  "\u{1D52D}": "pfr",
  "\u{1D4C5}": "pscr",
  "\u{1D561}": "popf",
  "\u2119": "Popf",
  "\u{1D513}": "Pfr",
  "\u{1D4AB}": "Pscr",
  "\u{1D562}": "qopf",
  "\u{1D52E}": "qfr",
  "\u{1D4C6}": "qscr",
  "\u{1D4AC}": "Qscr",
  "\u{1D514}": "Qfr",
  "\u211A": "Qopf",
  "\u0138": "kgreen",
  "\u{1D52F}": "rfr",
  "\u{1D563}": "ropf",
  "\u{1D4C7}": "rscr",
  "\u211B": "Rscr",
  "\u211C": "Re",
  "\u211D": "Ropf",
  "\u0155": "racute",
  "\u0154": "Racute",
  "\u0159": "rcaron",
  "\u0158": "Rcaron",
  "\u0157": "rcedil",
  "\u0156": "Rcedil",
  "\u{1D564}": "sopf",
  "\u{1D4C8}": "sscr",
  "\u{1D530}": "sfr",
  "\u{1D54A}": "Sopf",
  "\u{1D516}": "Sfr",
  "\u{1D4AE}": "Sscr",
  "\u24C8": "oS",
  "\u015B": "sacute",
  "\u015A": "Sacute",
  "\u015D": "scirc",
  "\u015C": "Scirc",
  "\u0161": "scaron",
  "\u0160": "Scaron",
  "\u015F": "scedil",
  "\u015E": "Scedil",
  "\xDF": "szlig",
  "\u{1D531}": "tfr",
  "\u{1D4C9}": "tscr",
  "\u{1D565}": "topf",
  "\u{1D4AF}": "Tscr",
  "\u{1D517}": "Tfr",
  "\u{1D54B}": "Topf",
  "\u0165": "tcaron",
  "\u0164": "Tcaron",
  "\u0163": "tcedil",
  "\u0162": "Tcedil",
  "\u2122": "trade",
  "\u0167": "tstrok",
  "\u0166": "Tstrok",
  "\u{1D4CA}": "uscr",
  "\u{1D566}": "uopf",
  "\u{1D532}": "ufr",
  "\u{1D54C}": "Uopf",
  "\u{1D518}": "Ufr",
  "\u{1D4B0}": "Uscr",
  "\xFA": "uacute",
  "\xDA": "Uacute",
  "\xF9": "ugrave",
  "\xD9": "Ugrave",
  "\u016D": "ubreve",
  "\u016C": "Ubreve",
  "\xFB": "ucirc",
  "\xDB": "Ucirc",
  "\u016F": "uring",
  "\u016E": "Uring",
  "\xFC": "uuml",
  "\xDC": "Uuml",
  "\u0171": "udblac",
  "\u0170": "Udblac",
  "\u0169": "utilde",
  "\u0168": "Utilde",
  "\u0173": "uogon",
  "\u0172": "Uogon",
  "\u016B": "umacr",
  "\u016A": "Umacr",
  "\u{1D533}": "vfr",
  "\u{1D567}": "vopf",
  "\u{1D4CB}": "vscr",
  "\u{1D519}": "Vfr",
  "\u{1D54D}": "Vopf",
  "\u{1D4B1}": "Vscr",
  "\u{1D568}": "wopf",
  "\u{1D4CC}": "wscr",
  "\u{1D534}": "wfr",
  "\u{1D4B2}": "Wscr",
  "\u{1D54E}": "Wopf",
  "\u{1D51A}": "Wfr",
  "\u0175": "wcirc",
  "\u0174": "Wcirc",
  "\u{1D535}": "xfr",
  "\u{1D4CD}": "xscr",
  "\u{1D569}": "xopf",
  "\u{1D54F}": "Xopf",
  "\u{1D51B}": "Xfr",
  "\u{1D4B3}": "Xscr",
  "\u{1D536}": "yfr",
  "\u{1D4CE}": "yscr",
  "\u{1D56A}": "yopf",
  "\u{1D4B4}": "Yscr",
  "\u{1D51C}": "Yfr",
  "\u{1D550}": "Yopf",
  "\xFD": "yacute",
  "\xDD": "Yacute",
  "\u0177": "ycirc",
  "\u0176": "Ycirc",
  "\xFF": "yuml",
  "\u0178": "Yuml",
  "\u{1D4CF}": "zscr",
  "\u{1D537}": "zfr",
  "\u{1D56B}": "zopf",
  "\u2128": "Zfr",
  "\u2124": "Zopf",
  "\u{1D4B5}": "Zscr",
  "\u017A": "zacute",
  "\u0179": "Zacute",
  "\u017E": "zcaron",
  "\u017D": "Zcaron",
  "\u017C": "zdot",
  "\u017B": "Zdot",
  "\u01B5": "imped",
  "\xFE": "thorn",
  "\xDE": "THORN",
  "\u0149": "napos",
  "\u03B1": "alpha",
  "\u0391": "Alpha",
  "\u03B2": "beta",
  "\u0392": "Beta",
  "\u03B3": "gamma",
  "\u0393": "Gamma",
  "\u03B4": "delta",
  "\u0394": "Delta",
  "\u03B5": "epsi",
  "\u03F5": "epsiv",
  "\u0395": "Epsilon",
  "\u03DD": "gammad",
  "\u03DC": "Gammad",
  "\u03B6": "zeta",
  "\u0396": "Zeta",
  "\u03B7": "eta",
  "\u0397": "Eta",
  "\u03B8": "theta",
  "\u03D1": "thetav",
  "\u0398": "Theta",
  "\u03B9": "iota",
  "\u0399": "Iota",
  "\u03BA": "kappa",
  "\u03F0": "kappav",
  "\u039A": "Kappa",
  "\u03BB": "lambda",
  "\u039B": "Lambda",
  "\u03BC": "mu",
  "\xB5": "micro",
  "\u039C": "Mu",
  "\u03BD": "nu",
  "\u039D": "Nu",
  "\u03BE": "xi",
  "\u039E": "Xi",
  "\u03BF": "omicron",
  "\u039F": "Omicron",
  "\u03C0": "pi",
  "\u03D6": "piv",
  "\u03A0": "Pi",
  "\u03C1": "rho",
  "\u03F1": "rhov",
  "\u03A1": "Rho",
  "\u03C3": "sigma",
  "\u03A3": "Sigma",
  "\u03C2": "sigmaf",
  "\u03C4": "tau",
  "\u03A4": "Tau",
  "\u03C5": "upsi",
  "\u03A5": "Upsilon",
  "\u03D2": "Upsi",
  "\u03C6": "phi",
  "\u03D5": "phiv",
  "\u03A6": "Phi",
  "\u03C7": "chi",
  "\u03A7": "Chi",
  "\u03C8": "psi",
  "\u03A8": "Psi",
  "\u03C9": "omega",
  "\u03A9": "ohm",
  "\u0430": "acy",
  "\u0410": "Acy",
  "\u0431": "bcy",
  "\u0411": "Bcy",
  "\u0432": "vcy",
  "\u0412": "Vcy",
  "\u0433": "gcy",
  "\u0413": "Gcy",
  "\u0453": "gjcy",
  "\u0403": "GJcy",
  "\u0434": "dcy",
  "\u0414": "Dcy",
  "\u0452": "djcy",
  "\u0402": "DJcy",
  "\u0435": "iecy",
  "\u0415": "IEcy",
  "\u0451": "iocy",
  "\u0401": "IOcy",
  "\u0454": "jukcy",
  "\u0404": "Jukcy",
  "\u0436": "zhcy",
  "\u0416": "ZHcy",
  "\u0437": "zcy",
  "\u0417": "Zcy",
  "\u0455": "dscy",
  "\u0405": "DScy",
  "\u0438": "icy",
  "\u0418": "Icy",
  "\u0456": "iukcy",
  "\u0406": "Iukcy",
  "\u0457": "yicy",
  "\u0407": "YIcy",
  "\u0439": "jcy",
  "\u0419": "Jcy",
  "\u0458": "jsercy",
  "\u0408": "Jsercy",
  "\u043A": "kcy",
  "\u041A": "Kcy",
  "\u045C": "kjcy",
  "\u040C": "KJcy",
  "\u043B": "lcy",
  "\u041B": "Lcy",
  "\u0459": "ljcy",
  "\u0409": "LJcy",
  "\u043C": "mcy",
  "\u041C": "Mcy",
  "\u043D": "ncy",
  "\u041D": "Ncy",
  "\u045A": "njcy",
  "\u040A": "NJcy",
  "\u043E": "ocy",
  "\u041E": "Ocy",
  "\u043F": "pcy",
  "\u041F": "Pcy",
  "\u0440": "rcy",
  "\u0420": "Rcy",
  "\u0441": "scy",
  "\u0421": "Scy",
  "\u0442": "tcy",
  "\u0422": "Tcy",
  "\u045B": "tshcy",
  "\u040B": "TSHcy",
  "\u0443": "ucy",
  "\u0423": "Ucy",
  "\u045E": "ubrcy",
  "\u040E": "Ubrcy",
  "\u0444": "fcy",
  "\u0424": "Fcy",
  "\u0445": "khcy",
  "\u0425": "KHcy",
  "\u0446": "tscy",
  "\u0426": "TScy",
  "\u0447": "chcy",
  "\u0427": "CHcy",
  "\u045F": "dzcy",
  "\u040F": "DZcy",
  "\u0448": "shcy",
  "\u0428": "SHcy",
  "\u0449": "shchcy",
  "\u0429": "SHCHcy",
  "\u044A": "hardcy",
  "\u042A": "HARDcy",
  "\u044B": "ycy",
  "\u042B": "Ycy",
  "\u044C": "softcy",
  "\u042C": "SOFTcy",
  "\u044D": "ecy",
  "\u042D": "Ecy",
  "\u044E": "yucy",
  "\u042E": "YUcy",
  "\u044F": "yacy",
  "\u042F": "YAcy",
  "\u2135": "aleph",
  "\u2136": "beth",
  "\u2137": "gimel",
  "\u2138": "daleth"
};
var regexEscape = /["&'<>`]/g;
var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
var decodeMap = {
  aacute: "\xE1",
  Aacute: "\xC1",
  abreve: "\u0103",
  Abreve: "\u0102",
  ac: "\u223E",
  acd: "\u223F",
  acE: "\u223E\u0333",
  acirc: "\xE2",
  Acirc: "\xC2",
  acute: "\xB4",
  acy: "\u0430",
  Acy: "\u0410",
  aelig: "\xE6",
  AElig: "\xC6",
  af: "\u2061",
  afr: "\u{1D51E}",
  Afr: "\u{1D504}",
  agrave: "\xE0",
  Agrave: "\xC0",
  alefsym: "\u2135",
  aleph: "\u2135",
  alpha: "\u03B1",
  Alpha: "\u0391",
  amacr: "\u0101",
  Amacr: "\u0100",
  amalg: "\u2A3F",
  amp: "&",
  AMP: "&",
  and: "\u2227",
  And: "\u2A53",
  andand: "\u2A55",
  andd: "\u2A5C",
  andslope: "\u2A58",
  andv: "\u2A5A",
  ang: "\u2220",
  ange: "\u29A4",
  angle: "\u2220",
  angmsd: "\u2221",
  angmsdaa: "\u29A8",
  angmsdab: "\u29A9",
  angmsdac: "\u29AA",
  angmsdad: "\u29AB",
  angmsdae: "\u29AC",
  angmsdaf: "\u29AD",
  angmsdag: "\u29AE",
  angmsdah: "\u29AF",
  angrt: "\u221F",
  angrtvb: "\u22BE",
  angrtvbd: "\u299D",
  angsph: "\u2222",
  angst: "\xC5",
  angzarr: "\u237C",
  aogon: "\u0105",
  Aogon: "\u0104",
  aopf: "\u{1D552}",
  Aopf: "\u{1D538}",
  ap: "\u2248",
  apacir: "\u2A6F",
  ape: "\u224A",
  apE: "\u2A70",
  apid: "\u224B",
  apos: "'",
  ApplyFunction: "\u2061",
  approx: "\u2248",
  approxeq: "\u224A",
  aring: "\xE5",
  Aring: "\xC5",
  ascr: "\u{1D4B6}",
  Ascr: "\u{1D49C}",
  Assign: "\u2254",
  ast: "*",
  asymp: "\u2248",
  asympeq: "\u224D",
  atilde: "\xE3",
  Atilde: "\xC3",
  auml: "\xE4",
  Auml: "\xC4",
  awconint: "\u2233",
  awint: "\u2A11",
  backcong: "\u224C",
  backepsilon: "\u03F6",
  backprime: "\u2035",
  backsim: "\u223D",
  backsimeq: "\u22CD",
  Backslash: "\u2216",
  Barv: "\u2AE7",
  barvee: "\u22BD",
  barwed: "\u2305",
  Barwed: "\u2306",
  barwedge: "\u2305",
  bbrk: "\u23B5",
  bbrktbrk: "\u23B6",
  bcong: "\u224C",
  bcy: "\u0431",
  Bcy: "\u0411",
  bdquo: "\u201E",
  becaus: "\u2235",
  because: "\u2235",
  Because: "\u2235",
  bemptyv: "\u29B0",
  bepsi: "\u03F6",
  bernou: "\u212C",
  Bernoullis: "\u212C",
  beta: "\u03B2",
  Beta: "\u0392",
  beth: "\u2136",
  between: "\u226C",
  bfr: "\u{1D51F}",
  Bfr: "\u{1D505}",
  bigcap: "\u22C2",
  bigcirc: "\u25EF",
  bigcup: "\u22C3",
  bigodot: "\u2A00",
  bigoplus: "\u2A01",
  bigotimes: "\u2A02",
  bigsqcup: "\u2A06",
  bigstar: "\u2605",
  bigtriangledown: "\u25BD",
  bigtriangleup: "\u25B3",
  biguplus: "\u2A04",
  bigvee: "\u22C1",
  bigwedge: "\u22C0",
  bkarow: "\u290D",
  blacklozenge: "\u29EB",
  blacksquare: "\u25AA",
  blacktriangle: "\u25B4",
  blacktriangledown: "\u25BE",
  blacktriangleleft: "\u25C2",
  blacktriangleright: "\u25B8",
  blank: "\u2423",
  blk12: "\u2592",
  blk14: "\u2591",
  blk34: "\u2593",
  block: "\u2588",
  bne: "=\u20E5",
  bnequiv: "\u2261\u20E5",
  bnot: "\u2310",
  bNot: "\u2AED",
  bopf: "\u{1D553}",
  Bopf: "\u{1D539}",
  bot: "\u22A5",
  bottom: "\u22A5",
  bowtie: "\u22C8",
  boxbox: "\u29C9",
  boxdl: "\u2510",
  boxdL: "\u2555",
  boxDl: "\u2556",
  boxDL: "\u2557",
  boxdr: "\u250C",
  boxdR: "\u2552",
  boxDr: "\u2553",
  boxDR: "\u2554",
  boxh: "\u2500",
  boxH: "\u2550",
  boxhd: "\u252C",
  boxhD: "\u2565",
  boxHd: "\u2564",
  boxHD: "\u2566",
  boxhu: "\u2534",
  boxhU: "\u2568",
  boxHu: "\u2567",
  boxHU: "\u2569",
  boxminus: "\u229F",
  boxplus: "\u229E",
  boxtimes: "\u22A0",
  boxul: "\u2518",
  boxuL: "\u255B",
  boxUl: "\u255C",
  boxUL: "\u255D",
  boxur: "\u2514",
  boxuR: "\u2558",
  boxUr: "\u2559",
  boxUR: "\u255A",
  boxv: "\u2502",
  boxV: "\u2551",
  boxvh: "\u253C",
  boxvH: "\u256A",
  boxVh: "\u256B",
  boxVH: "\u256C",
  boxvl: "\u2524",
  boxvL: "\u2561",
  boxVl: "\u2562",
  boxVL: "\u2563",
  boxvr: "\u251C",
  boxvR: "\u255E",
  boxVr: "\u255F",
  boxVR: "\u2560",
  bprime: "\u2035",
  breve: "\u02D8",
  Breve: "\u02D8",
  brvbar: "\xA6",
  bscr: "\u{1D4B7}",
  Bscr: "\u212C",
  bsemi: "\u204F",
  bsim: "\u223D",
  bsime: "\u22CD",
  bsol: "\\",
  bsolb: "\u29C5",
  bsolhsub: "\u27C8",
  bull: "\u2022",
  bullet: "\u2022",
  bump: "\u224E",
  bumpe: "\u224F",
  bumpE: "\u2AAE",
  bumpeq: "\u224F",
  Bumpeq: "\u224E",
  cacute: "\u0107",
  Cacute: "\u0106",
  cap: "\u2229",
  Cap: "\u22D2",
  capand: "\u2A44",
  capbrcup: "\u2A49",
  capcap: "\u2A4B",
  capcup: "\u2A47",
  capdot: "\u2A40",
  CapitalDifferentialD: "\u2145",
  caps: "\u2229\uFE00",
  caret: "\u2041",
  caron: "\u02C7",
  Cayleys: "\u212D",
  ccaps: "\u2A4D",
  ccaron: "\u010D",
  Ccaron: "\u010C",
  ccedil: "\xE7",
  Ccedil: "\xC7",
  ccirc: "\u0109",
  Ccirc: "\u0108",
  Cconint: "\u2230",
  ccups: "\u2A4C",
  ccupssm: "\u2A50",
  cdot: "\u010B",
  Cdot: "\u010A",
  cedil: "\xB8",
  Cedilla: "\xB8",
  cemptyv: "\u29B2",
  cent: "\xA2",
  centerdot: "\xB7",
  CenterDot: "\xB7",
  cfr: "\u{1D520}",
  Cfr: "\u212D",
  chcy: "\u0447",
  CHcy: "\u0427",
  check: "\u2713",
  checkmark: "\u2713",
  chi: "\u03C7",
  Chi: "\u03A7",
  cir: "\u25CB",
  circ: "\u02C6",
  circeq: "\u2257",
  circlearrowleft: "\u21BA",
  circlearrowright: "\u21BB",
  circledast: "\u229B",
  circledcirc: "\u229A",
  circleddash: "\u229D",
  CircleDot: "\u2299",
  circledR: "\xAE",
  circledS: "\u24C8",
  CircleMinus: "\u2296",
  CirclePlus: "\u2295",
  CircleTimes: "\u2297",
  cire: "\u2257",
  cirE: "\u29C3",
  cirfnint: "\u2A10",
  cirmid: "\u2AEF",
  cirscir: "\u29C2",
  ClockwiseContourIntegral: "\u2232",
  CloseCurlyDoubleQuote: "\u201D",
  CloseCurlyQuote: "\u2019",
  clubs: "\u2663",
  clubsuit: "\u2663",
  colon: ":",
  Colon: "\u2237",
  colone: "\u2254",
  Colone: "\u2A74",
  coloneq: "\u2254",
  comma: ",",
  commat: "@",
  comp: "\u2201",
  compfn: "\u2218",
  complement: "\u2201",
  complexes: "\u2102",
  cong: "\u2245",
  congdot: "\u2A6D",
  Congruent: "\u2261",
  conint: "\u222E",
  Conint: "\u222F",
  ContourIntegral: "\u222E",
  copf: "\u{1D554}",
  Copf: "\u2102",
  coprod: "\u2210",
  Coproduct: "\u2210",
  copy: "\xA9",
  COPY: "\xA9",
  copysr: "\u2117",
  CounterClockwiseContourIntegral: "\u2233",
  crarr: "\u21B5",
  cross: "\u2717",
  Cross: "\u2A2F",
  cscr: "\u{1D4B8}",
  Cscr: "\u{1D49E}",
  csub: "\u2ACF",
  csube: "\u2AD1",
  csup: "\u2AD0",
  csupe: "\u2AD2",
  ctdot: "\u22EF",
  cudarrl: "\u2938",
  cudarrr: "\u2935",
  cuepr: "\u22DE",
  cuesc: "\u22DF",
  cularr: "\u21B6",
  cularrp: "\u293D",
  cup: "\u222A",
  Cup: "\u22D3",
  cupbrcap: "\u2A48",
  cupcap: "\u2A46",
  CupCap: "\u224D",
  cupcup: "\u2A4A",
  cupdot: "\u228D",
  cupor: "\u2A45",
  cups: "\u222A\uFE00",
  curarr: "\u21B7",
  curarrm: "\u293C",
  curlyeqprec: "\u22DE",
  curlyeqsucc: "\u22DF",
  curlyvee: "\u22CE",
  curlywedge: "\u22CF",
  curren: "\xA4",
  curvearrowleft: "\u21B6",
  curvearrowright: "\u21B7",
  cuvee: "\u22CE",
  cuwed: "\u22CF",
  cwconint: "\u2232",
  cwint: "\u2231",
  cylcty: "\u232D",
  dagger: "\u2020",
  Dagger: "\u2021",
  daleth: "\u2138",
  darr: "\u2193",
  dArr: "\u21D3",
  Darr: "\u21A1",
  dash: "\u2010",
  dashv: "\u22A3",
  Dashv: "\u2AE4",
  dbkarow: "\u290F",
  dblac: "\u02DD",
  dcaron: "\u010F",
  Dcaron: "\u010E",
  dcy: "\u0434",
  Dcy: "\u0414",
  dd: "\u2146",
  DD: "\u2145",
  ddagger: "\u2021",
  ddarr: "\u21CA",
  DDotrahd: "\u2911",
  ddotseq: "\u2A77",
  deg: "\xB0",
  Del: "\u2207",
  delta: "\u03B4",
  Delta: "\u0394",
  demptyv: "\u29B1",
  dfisht: "\u297F",
  dfr: "\u{1D521}",
  Dfr: "\u{1D507}",
  dHar: "\u2965",
  dharl: "\u21C3",
  dharr: "\u21C2",
  DiacriticalAcute: "\xB4",
  DiacriticalDot: "\u02D9",
  DiacriticalDoubleAcute: "\u02DD",
  DiacriticalGrave: "`",
  DiacriticalTilde: "\u02DC",
  diam: "\u22C4",
  diamond: "\u22C4",
  Diamond: "\u22C4",
  diamondsuit: "\u2666",
  diams: "\u2666",
  die: "\xA8",
  DifferentialD: "\u2146",
  digamma: "\u03DD",
  disin: "\u22F2",
  div: "\xF7",
  divide: "\xF7",
  divideontimes: "\u22C7",
  divonx: "\u22C7",
  djcy: "\u0452",
  DJcy: "\u0402",
  dlcorn: "\u231E",
  dlcrop: "\u230D",
  dollar: "$",
  dopf: "\u{1D555}",
  Dopf: "\u{1D53B}",
  dot: "\u02D9",
  Dot: "\xA8",
  DotDot: "\u20DC",
  doteq: "\u2250",
  doteqdot: "\u2251",
  DotEqual: "\u2250",
  dotminus: "\u2238",
  dotplus: "\u2214",
  dotsquare: "\u22A1",
  doublebarwedge: "\u2306",
  DoubleContourIntegral: "\u222F",
  DoubleDot: "\xA8",
  DoubleDownArrow: "\u21D3",
  DoubleLeftArrow: "\u21D0",
  DoubleLeftRightArrow: "\u21D4",
  DoubleLeftTee: "\u2AE4",
  DoubleLongLeftArrow: "\u27F8",
  DoubleLongLeftRightArrow: "\u27FA",
  DoubleLongRightArrow: "\u27F9",
  DoubleRightArrow: "\u21D2",
  DoubleRightTee: "\u22A8",
  DoubleUpArrow: "\u21D1",
  DoubleUpDownArrow: "\u21D5",
  DoubleVerticalBar: "\u2225",
  downarrow: "\u2193",
  Downarrow: "\u21D3",
  DownArrow: "\u2193",
  DownArrowBar: "\u2913",
  DownArrowUpArrow: "\u21F5",
  DownBreve: "\u0311",
  downdownarrows: "\u21CA",
  downharpoonleft: "\u21C3",
  downharpoonright: "\u21C2",
  DownLeftRightVector: "\u2950",
  DownLeftTeeVector: "\u295E",
  DownLeftVector: "\u21BD",
  DownLeftVectorBar: "\u2956",
  DownRightTeeVector: "\u295F",
  DownRightVector: "\u21C1",
  DownRightVectorBar: "\u2957",
  DownTee: "\u22A4",
  DownTeeArrow: "\u21A7",
  drbkarow: "\u2910",
  drcorn: "\u231F",
  drcrop: "\u230C",
  dscr: "\u{1D4B9}",
  Dscr: "\u{1D49F}",
  dscy: "\u0455",
  DScy: "\u0405",
  dsol: "\u29F6",
  dstrok: "\u0111",
  Dstrok: "\u0110",
  dtdot: "\u22F1",
  dtri: "\u25BF",
  dtrif: "\u25BE",
  duarr: "\u21F5",
  duhar: "\u296F",
  dwangle: "\u29A6",
  dzcy: "\u045F",
  DZcy: "\u040F",
  dzigrarr: "\u27FF",
  eacute: "\xE9",
  Eacute: "\xC9",
  easter: "\u2A6E",
  ecaron: "\u011B",
  Ecaron: "\u011A",
  ecir: "\u2256",
  ecirc: "\xEA",
  Ecirc: "\xCA",
  ecolon: "\u2255",
  ecy: "\u044D",
  Ecy: "\u042D",
  eDDot: "\u2A77",
  edot: "\u0117",
  eDot: "\u2251",
  Edot: "\u0116",
  ee: "\u2147",
  efDot: "\u2252",
  efr: "\u{1D522}",
  Efr: "\u{1D508}",
  eg: "\u2A9A",
  egrave: "\xE8",
  Egrave: "\xC8",
  egs: "\u2A96",
  egsdot: "\u2A98",
  el: "\u2A99",
  Element: "\u2208",
  elinters: "\u23E7",
  ell: "\u2113",
  els: "\u2A95",
  elsdot: "\u2A97",
  emacr: "\u0113",
  Emacr: "\u0112",
  empty: "\u2205",
  emptyset: "\u2205",
  EmptySmallSquare: "\u25FB",
  emptyv: "\u2205",
  EmptyVerySmallSquare: "\u25AB",
  emsp: "\u2003",
  emsp13: "\u2004",
  emsp14: "\u2005",
  eng: "\u014B",
  ENG: "\u014A",
  ensp: "\u2002",
  eogon: "\u0119",
  Eogon: "\u0118",
  eopf: "\u{1D556}",
  Eopf: "\u{1D53C}",
  epar: "\u22D5",
  eparsl: "\u29E3",
  eplus: "\u2A71",
  epsi: "\u03B5",
  epsilon: "\u03B5",
  Epsilon: "\u0395",
  epsiv: "\u03F5",
  eqcirc: "\u2256",
  eqcolon: "\u2255",
  eqsim: "\u2242",
  eqslantgtr: "\u2A96",
  eqslantless: "\u2A95",
  Equal: "\u2A75",
  equals: "=",
  EqualTilde: "\u2242",
  equest: "\u225F",
  Equilibrium: "\u21CC",
  equiv: "\u2261",
  equivDD: "\u2A78",
  eqvparsl: "\u29E5",
  erarr: "\u2971",
  erDot: "\u2253",
  escr: "\u212F",
  Escr: "\u2130",
  esdot: "\u2250",
  esim: "\u2242",
  Esim: "\u2A73",
  eta: "\u03B7",
  Eta: "\u0397",
  eth: "\xF0",
  ETH: "\xD0",
  euml: "\xEB",
  Euml: "\xCB",
  euro: "\u20AC",
  excl: "!",
  exist: "\u2203",
  Exists: "\u2203",
  expectation: "\u2130",
  exponentiale: "\u2147",
  ExponentialE: "\u2147",
  fallingdotseq: "\u2252",
  fcy: "\u0444",
  Fcy: "\u0424",
  female: "\u2640",
  ffilig: "\uFB03",
  fflig: "\uFB00",
  ffllig: "\uFB04",
  ffr: "\u{1D523}",
  Ffr: "\u{1D509}",
  filig: "\uFB01",
  FilledSmallSquare: "\u25FC",
  FilledVerySmallSquare: "\u25AA",
  fjlig: "fj",
  flat: "\u266D",
  fllig: "\uFB02",
  fltns: "\u25B1",
  fnof: "\u0192",
  fopf: "\u{1D557}",
  Fopf: "\u{1D53D}",
  forall: "\u2200",
  ForAll: "\u2200",
  fork: "\u22D4",
  forkv: "\u2AD9",
  Fouriertrf: "\u2131",
  fpartint: "\u2A0D",
  frac12: "\xBD",
  frac13: "\u2153",
  frac14: "\xBC",
  frac15: "\u2155",
  frac16: "\u2159",
  frac18: "\u215B",
  frac23: "\u2154",
  frac25: "\u2156",
  frac34: "\xBE",
  frac35: "\u2157",
  frac38: "\u215C",
  frac45: "\u2158",
  frac56: "\u215A",
  frac58: "\u215D",
  frac78: "\u215E",
  frasl: "\u2044",
  frown: "\u2322",
  fscr: "\u{1D4BB}",
  Fscr: "\u2131",
  gacute: "\u01F5",
  gamma: "\u03B3",
  Gamma: "\u0393",
  gammad: "\u03DD",
  Gammad: "\u03DC",
  gap: "\u2A86",
  gbreve: "\u011F",
  Gbreve: "\u011E",
  Gcedil: "\u0122",
  gcirc: "\u011D",
  Gcirc: "\u011C",
  gcy: "\u0433",
  Gcy: "\u0413",
  gdot: "\u0121",
  Gdot: "\u0120",
  ge: "\u2265",
  gE: "\u2267",
  gel: "\u22DB",
  gEl: "\u2A8C",
  geq: "\u2265",
  geqq: "\u2267",
  geqslant: "\u2A7E",
  ges: "\u2A7E",
  gescc: "\u2AA9",
  gesdot: "\u2A80",
  gesdoto: "\u2A82",
  gesdotol: "\u2A84",
  gesl: "\u22DB\uFE00",
  gesles: "\u2A94",
  gfr: "\u{1D524}",
  Gfr: "\u{1D50A}",
  gg: "\u226B",
  Gg: "\u22D9",
  ggg: "\u22D9",
  gimel: "\u2137",
  gjcy: "\u0453",
  GJcy: "\u0403",
  gl: "\u2277",
  gla: "\u2AA5",
  glE: "\u2A92",
  glj: "\u2AA4",
  gnap: "\u2A8A",
  gnapprox: "\u2A8A",
  gne: "\u2A88",
  gnE: "\u2269",
  gneq: "\u2A88",
  gneqq: "\u2269",
  gnsim: "\u22E7",
  gopf: "\u{1D558}",
  Gopf: "\u{1D53E}",
  grave: "`",
  GreaterEqual: "\u2265",
  GreaterEqualLess: "\u22DB",
  GreaterFullEqual: "\u2267",
  GreaterGreater: "\u2AA2",
  GreaterLess: "\u2277",
  GreaterSlantEqual: "\u2A7E",
  GreaterTilde: "\u2273",
  gscr: "\u210A",
  Gscr: "\u{1D4A2}",
  gsim: "\u2273",
  gsime: "\u2A8E",
  gsiml: "\u2A90",
  gt: ">",
  Gt: "\u226B",
  GT: ">",
  gtcc: "\u2AA7",
  gtcir: "\u2A7A",
  gtdot: "\u22D7",
  gtlPar: "\u2995",
  gtquest: "\u2A7C",
  gtrapprox: "\u2A86",
  gtrarr: "\u2978",
  gtrdot: "\u22D7",
  gtreqless: "\u22DB",
  gtreqqless: "\u2A8C",
  gtrless: "\u2277",
  gtrsim: "\u2273",
  gvertneqq: "\u2269\uFE00",
  gvnE: "\u2269\uFE00",
  Hacek: "\u02C7",
  hairsp: "\u200A",
  half: "\xBD",
  hamilt: "\u210B",
  hardcy: "\u044A",
  HARDcy: "\u042A",
  harr: "\u2194",
  hArr: "\u21D4",
  harrcir: "\u2948",
  harrw: "\u21AD",
  Hat: "^",
  hbar: "\u210F",
  hcirc: "\u0125",
  Hcirc: "\u0124",
  hearts: "\u2665",
  heartsuit: "\u2665",
  hellip: "\u2026",
  hercon: "\u22B9",
  hfr: "\u{1D525}",
  Hfr: "\u210C",
  HilbertSpace: "\u210B",
  hksearow: "\u2925",
  hkswarow: "\u2926",
  hoarr: "\u21FF",
  homtht: "\u223B",
  hookleftarrow: "\u21A9",
  hookrightarrow: "\u21AA",
  hopf: "\u{1D559}",
  Hopf: "\u210D",
  horbar: "\u2015",
  HorizontalLine: "\u2500",
  hscr: "\u{1D4BD}",
  Hscr: "\u210B",
  hslash: "\u210F",
  hstrok: "\u0127",
  Hstrok: "\u0126",
  HumpDownHump: "\u224E",
  HumpEqual: "\u224F",
  hybull: "\u2043",
  hyphen: "\u2010",
  iacute: "\xED",
  Iacute: "\xCD",
  ic: "\u2063",
  icirc: "\xEE",
  Icirc: "\xCE",
  icy: "\u0438",
  Icy: "\u0418",
  Idot: "\u0130",
  iecy: "\u0435",
  IEcy: "\u0415",
  iexcl: "\xA1",
  iff: "\u21D4",
  ifr: "\u{1D526}",
  Ifr: "\u2111",
  igrave: "\xEC",
  Igrave: "\xCC",
  ii: "\u2148",
  iiiint: "\u2A0C",
  iiint: "\u222D",
  iinfin: "\u29DC",
  iiota: "\u2129",
  ijlig: "\u0133",
  IJlig: "\u0132",
  Im: "\u2111",
  imacr: "\u012B",
  Imacr: "\u012A",
  image: "\u2111",
  ImaginaryI: "\u2148",
  imagline: "\u2110",
  imagpart: "\u2111",
  imath: "\u0131",
  imof: "\u22B7",
  imped: "\u01B5",
  Implies: "\u21D2",
  in: "\u2208",
  incare: "\u2105",
  infin: "\u221E",
  infintie: "\u29DD",
  inodot: "\u0131",
  int: "\u222B",
  Int: "\u222C",
  intcal: "\u22BA",
  integers: "\u2124",
  Integral: "\u222B",
  intercal: "\u22BA",
  Intersection: "\u22C2",
  intlarhk: "\u2A17",
  intprod: "\u2A3C",
  InvisibleComma: "\u2063",
  InvisibleTimes: "\u2062",
  iocy: "\u0451",
  IOcy: "\u0401",
  iogon: "\u012F",
  Iogon: "\u012E",
  iopf: "\u{1D55A}",
  Iopf: "\u{1D540}",
  iota: "\u03B9",
  Iota: "\u0399",
  iprod: "\u2A3C",
  iquest: "\xBF",
  iscr: "\u{1D4BE}",
  Iscr: "\u2110",
  isin: "\u2208",
  isindot: "\u22F5",
  isinE: "\u22F9",
  isins: "\u22F4",
  isinsv: "\u22F3",
  isinv: "\u2208",
  it: "\u2062",
  itilde: "\u0129",
  Itilde: "\u0128",
  iukcy: "\u0456",
  Iukcy: "\u0406",
  iuml: "\xEF",
  Iuml: "\xCF",
  jcirc: "\u0135",
  Jcirc: "\u0134",
  jcy: "\u0439",
  Jcy: "\u0419",
  jfr: "\u{1D527}",
  Jfr: "\u{1D50D}",
  jmath: "\u0237",
  jopf: "\u{1D55B}",
  Jopf: "\u{1D541}",
  jscr: "\u{1D4BF}",
  Jscr: "\u{1D4A5}",
  jsercy: "\u0458",
  Jsercy: "\u0408",
  jukcy: "\u0454",
  Jukcy: "\u0404",
  kappa: "\u03BA",
  Kappa: "\u039A",
  kappav: "\u03F0",
  kcedil: "\u0137",
  Kcedil: "\u0136",
  kcy: "\u043A",
  Kcy: "\u041A",
  kfr: "\u{1D528}",
  Kfr: "\u{1D50E}",
  kgreen: "\u0138",
  khcy: "\u0445",
  KHcy: "\u0425",
  kjcy: "\u045C",
  KJcy: "\u040C",
  kopf: "\u{1D55C}",
  Kopf: "\u{1D542}",
  kscr: "\u{1D4C0}",
  Kscr: "\u{1D4A6}",
  lAarr: "\u21DA",
  lacute: "\u013A",
  Lacute: "\u0139",
  laemptyv: "\u29B4",
  lagran: "\u2112",
  lambda: "\u03BB",
  Lambda: "\u039B",
  lang: "\u27E8",
  Lang: "\u27EA",
  langd: "\u2991",
  langle: "\u27E8",
  lap: "\u2A85",
  Laplacetrf: "\u2112",
  laquo: "\xAB",
  larr: "\u2190",
  lArr: "\u21D0",
  Larr: "\u219E",
  larrb: "\u21E4",
  larrbfs: "\u291F",
  larrfs: "\u291D",
  larrhk: "\u21A9",
  larrlp: "\u21AB",
  larrpl: "\u2939",
  larrsim: "\u2973",
  larrtl: "\u21A2",
  lat: "\u2AAB",
  latail: "\u2919",
  lAtail: "\u291B",
  late: "\u2AAD",
  lates: "\u2AAD\uFE00",
  lbarr: "\u290C",
  lBarr: "\u290E",
  lbbrk: "\u2772",
  lbrace: "{",
  lbrack: "[",
  lbrke: "\u298B",
  lbrksld: "\u298F",
  lbrkslu: "\u298D",
  lcaron: "\u013E",
  Lcaron: "\u013D",
  lcedil: "\u013C",
  Lcedil: "\u013B",
  lceil: "\u2308",
  lcub: "{",
  lcy: "\u043B",
  Lcy: "\u041B",
  ldca: "\u2936",
  ldquo: "\u201C",
  ldquor: "\u201E",
  ldrdhar: "\u2967",
  ldrushar: "\u294B",
  ldsh: "\u21B2",
  le: "\u2264",
  lE: "\u2266",
  LeftAngleBracket: "\u27E8",
  leftarrow: "\u2190",
  Leftarrow: "\u21D0",
  LeftArrow: "\u2190",
  LeftArrowBar: "\u21E4",
  LeftArrowRightArrow: "\u21C6",
  leftarrowtail: "\u21A2",
  LeftCeiling: "\u2308",
  LeftDoubleBracket: "\u27E6",
  LeftDownTeeVector: "\u2961",
  LeftDownVector: "\u21C3",
  LeftDownVectorBar: "\u2959",
  LeftFloor: "\u230A",
  leftharpoondown: "\u21BD",
  leftharpoonup: "\u21BC",
  leftleftarrows: "\u21C7",
  leftrightarrow: "\u2194",
  Leftrightarrow: "\u21D4",
  LeftRightArrow: "\u2194",
  leftrightarrows: "\u21C6",
  leftrightharpoons: "\u21CB",
  leftrightsquigarrow: "\u21AD",
  LeftRightVector: "\u294E",
  LeftTee: "\u22A3",
  LeftTeeArrow: "\u21A4",
  LeftTeeVector: "\u295A",
  leftthreetimes: "\u22CB",
  LeftTriangle: "\u22B2",
  LeftTriangleBar: "\u29CF",
  LeftTriangleEqual: "\u22B4",
  LeftUpDownVector: "\u2951",
  LeftUpTeeVector: "\u2960",
  LeftUpVector: "\u21BF",
  LeftUpVectorBar: "\u2958",
  LeftVector: "\u21BC",
  LeftVectorBar: "\u2952",
  leg: "\u22DA",
  lEg: "\u2A8B",
  leq: "\u2264",
  leqq: "\u2266",
  leqslant: "\u2A7D",
  les: "\u2A7D",
  lescc: "\u2AA8",
  lesdot: "\u2A7F",
  lesdoto: "\u2A81",
  lesdotor: "\u2A83",
  lesg: "\u22DA\uFE00",
  lesges: "\u2A93",
  lessapprox: "\u2A85",
  lessdot: "\u22D6",
  lesseqgtr: "\u22DA",
  lesseqqgtr: "\u2A8B",
  LessEqualGreater: "\u22DA",
  LessFullEqual: "\u2266",
  LessGreater: "\u2276",
  lessgtr: "\u2276",
  LessLess: "\u2AA1",
  lesssim: "\u2272",
  LessSlantEqual: "\u2A7D",
  LessTilde: "\u2272",
  lfisht: "\u297C",
  lfloor: "\u230A",
  lfr: "\u{1D529}",
  Lfr: "\u{1D50F}",
  lg: "\u2276",
  lgE: "\u2A91",
  lHar: "\u2962",
  lhard: "\u21BD",
  lharu: "\u21BC",
  lharul: "\u296A",
  lhblk: "\u2584",
  ljcy: "\u0459",
  LJcy: "\u0409",
  ll: "\u226A",
  Ll: "\u22D8",
  llarr: "\u21C7",
  llcorner: "\u231E",
  Lleftarrow: "\u21DA",
  llhard: "\u296B",
  lltri: "\u25FA",
  lmidot: "\u0140",
  Lmidot: "\u013F",
  lmoust: "\u23B0",
  lmoustache: "\u23B0",
  lnap: "\u2A89",
  lnapprox: "\u2A89",
  lne: "\u2A87",
  lnE: "\u2268",
  lneq: "\u2A87",
  lneqq: "\u2268",
  lnsim: "\u22E6",
  loang: "\u27EC",
  loarr: "\u21FD",
  lobrk: "\u27E6",
  longleftarrow: "\u27F5",
  Longleftarrow: "\u27F8",
  LongLeftArrow: "\u27F5",
  longleftrightarrow: "\u27F7",
  Longleftrightarrow: "\u27FA",
  LongLeftRightArrow: "\u27F7",
  longmapsto: "\u27FC",
  longrightarrow: "\u27F6",
  Longrightarrow: "\u27F9",
  LongRightArrow: "\u27F6",
  looparrowleft: "\u21AB",
  looparrowright: "\u21AC",
  lopar: "\u2985",
  lopf: "\u{1D55D}",
  Lopf: "\u{1D543}",
  loplus: "\u2A2D",
  lotimes: "\u2A34",
  lowast: "\u2217",
  lowbar: "_",
  LowerLeftArrow: "\u2199",
  LowerRightArrow: "\u2198",
  loz: "\u25CA",
  lozenge: "\u25CA",
  lozf: "\u29EB",
  lpar: "(",
  lparlt: "\u2993",
  lrarr: "\u21C6",
  lrcorner: "\u231F",
  lrhar: "\u21CB",
  lrhard: "\u296D",
  lrm: "\u200E",
  lrtri: "\u22BF",
  lsaquo: "\u2039",
  lscr: "\u{1D4C1}",
  Lscr: "\u2112",
  lsh: "\u21B0",
  Lsh: "\u21B0",
  lsim: "\u2272",
  lsime: "\u2A8D",
  lsimg: "\u2A8F",
  lsqb: "[",
  lsquo: "\u2018",
  lsquor: "\u201A",
  lstrok: "\u0142",
  Lstrok: "\u0141",
  lt: "<",
  Lt: "\u226A",
  LT: "<",
  ltcc: "\u2AA6",
  ltcir: "\u2A79",
  ltdot: "\u22D6",
  lthree: "\u22CB",
  ltimes: "\u22C9",
  ltlarr: "\u2976",
  ltquest: "\u2A7B",
  ltri: "\u25C3",
  ltrie: "\u22B4",
  ltrif: "\u25C2",
  ltrPar: "\u2996",
  lurdshar: "\u294A",
  luruhar: "\u2966",
  lvertneqq: "\u2268\uFE00",
  lvnE: "\u2268\uFE00",
  macr: "\xAF",
  male: "\u2642",
  malt: "\u2720",
  maltese: "\u2720",
  map: "\u21A6",
  Map: "\u2905",
  mapsto: "\u21A6",
  mapstodown: "\u21A7",
  mapstoleft: "\u21A4",
  mapstoup: "\u21A5",
  marker: "\u25AE",
  mcomma: "\u2A29",
  mcy: "\u043C",
  Mcy: "\u041C",
  mdash: "\u2014",
  mDDot: "\u223A",
  measuredangle: "\u2221",
  MediumSpace: "\u205F",
  Mellintrf: "\u2133",
  mfr: "\u{1D52A}",
  Mfr: "\u{1D510}",
  mho: "\u2127",
  micro: "\xB5",
  mid: "\u2223",
  midast: "*",
  midcir: "\u2AF0",
  middot: "\xB7",
  minus: "\u2212",
  minusb: "\u229F",
  minusd: "\u2238",
  minusdu: "\u2A2A",
  MinusPlus: "\u2213",
  mlcp: "\u2ADB",
  mldr: "\u2026",
  mnplus: "\u2213",
  models: "\u22A7",
  mopf: "\u{1D55E}",
  Mopf: "\u{1D544}",
  mp: "\u2213",
  mscr: "\u{1D4C2}",
  Mscr: "\u2133",
  mstpos: "\u223E",
  mu: "\u03BC",
  Mu: "\u039C",
  multimap: "\u22B8",
  mumap: "\u22B8",
  nabla: "\u2207",
  nacute: "\u0144",
  Nacute: "\u0143",
  nang: "\u2220\u20D2",
  nap: "\u2249",
  napE: "\u2A70\u0338",
  napid: "\u224B\u0338",
  napos: "\u0149",
  napprox: "\u2249",
  natur: "\u266E",
  natural: "\u266E",
  naturals: "\u2115",
  nbsp: "\xA0",
  nbump: "\u224E\u0338",
  nbumpe: "\u224F\u0338",
  ncap: "\u2A43",
  ncaron: "\u0148",
  Ncaron: "\u0147",
  ncedil: "\u0146",
  Ncedil: "\u0145",
  ncong: "\u2247",
  ncongdot: "\u2A6D\u0338",
  ncup: "\u2A42",
  ncy: "\u043D",
  Ncy: "\u041D",
  ndash: "\u2013",
  ne: "\u2260",
  nearhk: "\u2924",
  nearr: "\u2197",
  neArr: "\u21D7",
  nearrow: "\u2197",
  nedot: "\u2250\u0338",
  NegativeMediumSpace: "\u200B",
  NegativeThickSpace: "\u200B",
  NegativeThinSpace: "\u200B",
  NegativeVeryThinSpace: "\u200B",
  nequiv: "\u2262",
  nesear: "\u2928",
  nesim: "\u2242\u0338",
  NestedGreaterGreater: "\u226B",
  NestedLessLess: "\u226A",
  NewLine: "\n",
  nexist: "\u2204",
  nexists: "\u2204",
  nfr: "\u{1D52B}",
  Nfr: "\u{1D511}",
  nge: "\u2271",
  ngE: "\u2267\u0338",
  ngeq: "\u2271",
  ngeqq: "\u2267\u0338",
  ngeqslant: "\u2A7E\u0338",
  nges: "\u2A7E\u0338",
  nGg: "\u22D9\u0338",
  ngsim: "\u2275",
  ngt: "\u226F",
  nGt: "\u226B\u20D2",
  ngtr: "\u226F",
  nGtv: "\u226B\u0338",
  nharr: "\u21AE",
  nhArr: "\u21CE",
  nhpar: "\u2AF2",
  ni: "\u220B",
  nis: "\u22FC",
  nisd: "\u22FA",
  niv: "\u220B",
  njcy: "\u045A",
  NJcy: "\u040A",
  nlarr: "\u219A",
  nlArr: "\u21CD",
  nldr: "\u2025",
  nle: "\u2270",
  nlE: "\u2266\u0338",
  nleftarrow: "\u219A",
  nLeftarrow: "\u21CD",
  nleftrightarrow: "\u21AE",
  nLeftrightarrow: "\u21CE",
  nleq: "\u2270",
  nleqq: "\u2266\u0338",
  nleqslant: "\u2A7D\u0338",
  nles: "\u2A7D\u0338",
  nless: "\u226E",
  nLl: "\u22D8\u0338",
  nlsim: "\u2274",
  nlt: "\u226E",
  nLt: "\u226A\u20D2",
  nltri: "\u22EA",
  nltrie: "\u22EC",
  nLtv: "\u226A\u0338",
  nmid: "\u2224",
  NoBreak: "\u2060",
  NonBreakingSpace: "\xA0",
  nopf: "\u{1D55F}",
  Nopf: "\u2115",
  not: "\xAC",
  Not: "\u2AEC",
  NotCongruent: "\u2262",
  NotCupCap: "\u226D",
  NotDoubleVerticalBar: "\u2226",
  NotElement: "\u2209",
  NotEqual: "\u2260",
  NotEqualTilde: "\u2242\u0338",
  NotExists: "\u2204",
  NotGreater: "\u226F",
  NotGreaterEqual: "\u2271",
  NotGreaterFullEqual: "\u2267\u0338",
  NotGreaterGreater: "\u226B\u0338",
  NotGreaterLess: "\u2279",
  NotGreaterSlantEqual: "\u2A7E\u0338",
  NotGreaterTilde: "\u2275",
  NotHumpDownHump: "\u224E\u0338",
  NotHumpEqual: "\u224F\u0338",
  notin: "\u2209",
  notindot: "\u22F5\u0338",
  notinE: "\u22F9\u0338",
  notinva: "\u2209",
  notinvb: "\u22F7",
  notinvc: "\u22F6",
  NotLeftTriangle: "\u22EA",
  NotLeftTriangleBar: "\u29CF\u0338",
  NotLeftTriangleEqual: "\u22EC",
  NotLess: "\u226E",
  NotLessEqual: "\u2270",
  NotLessGreater: "\u2278",
  NotLessLess: "\u226A\u0338",
  NotLessSlantEqual: "\u2A7D\u0338",
  NotLessTilde: "\u2274",
  NotNestedGreaterGreater: "\u2AA2\u0338",
  NotNestedLessLess: "\u2AA1\u0338",
  notni: "\u220C",
  notniva: "\u220C",
  notnivb: "\u22FE",
  notnivc: "\u22FD",
  NotPrecedes: "\u2280",
  NotPrecedesEqual: "\u2AAF\u0338",
  NotPrecedesSlantEqual: "\u22E0",
  NotReverseElement: "\u220C",
  NotRightTriangle: "\u22EB",
  NotRightTriangleBar: "\u29D0\u0338",
  NotRightTriangleEqual: "\u22ED",
  NotSquareSubset: "\u228F\u0338",
  NotSquareSubsetEqual: "\u22E2",
  NotSquareSuperset: "\u2290\u0338",
  NotSquareSupersetEqual: "\u22E3",
  NotSubset: "\u2282\u20D2",
  NotSubsetEqual: "\u2288",
  NotSucceeds: "\u2281",
  NotSucceedsEqual: "\u2AB0\u0338",
  NotSucceedsSlantEqual: "\u22E1",
  NotSucceedsTilde: "\u227F\u0338",
  NotSuperset: "\u2283\u20D2",
  NotSupersetEqual: "\u2289",
  NotTilde: "\u2241",
  NotTildeEqual: "\u2244",
  NotTildeFullEqual: "\u2247",
  NotTildeTilde: "\u2249",
  NotVerticalBar: "\u2224",
  npar: "\u2226",
  nparallel: "\u2226",
  nparsl: "\u2AFD\u20E5",
  npart: "\u2202\u0338",
  npolint: "\u2A14",
  npr: "\u2280",
  nprcue: "\u22E0",
  npre: "\u2AAF\u0338",
  nprec: "\u2280",
  npreceq: "\u2AAF\u0338",
  nrarr: "\u219B",
  nrArr: "\u21CF",
  nrarrc: "\u2933\u0338",
  nrarrw: "\u219D\u0338",
  nrightarrow: "\u219B",
  nRightarrow: "\u21CF",
  nrtri: "\u22EB",
  nrtrie: "\u22ED",
  nsc: "\u2281",
  nsccue: "\u22E1",
  nsce: "\u2AB0\u0338",
  nscr: "\u{1D4C3}",
  Nscr: "\u{1D4A9}",
  nshortmid: "\u2224",
  nshortparallel: "\u2226",
  nsim: "\u2241",
  nsime: "\u2244",
  nsimeq: "\u2244",
  nsmid: "\u2224",
  nspar: "\u2226",
  nsqsube: "\u22E2",
  nsqsupe: "\u22E3",
  nsub: "\u2284",
  nsube: "\u2288",
  nsubE: "\u2AC5\u0338",
  nsubset: "\u2282\u20D2",
  nsubseteq: "\u2288",
  nsubseteqq: "\u2AC5\u0338",
  nsucc: "\u2281",
  nsucceq: "\u2AB0\u0338",
  nsup: "\u2285",
  nsupe: "\u2289",
  nsupE: "\u2AC6\u0338",
  nsupset: "\u2283\u20D2",
  nsupseteq: "\u2289",
  nsupseteqq: "\u2AC6\u0338",
  ntgl: "\u2279",
  ntilde: "\xF1",
  Ntilde: "\xD1",
  ntlg: "\u2278",
  ntriangleleft: "\u22EA",
  ntrianglelefteq: "\u22EC",
  ntriangleright: "\u22EB",
  ntrianglerighteq: "\u22ED",
  nu: "\u03BD",
  Nu: "\u039D",
  num: "#",
  numero: "\u2116",
  numsp: "\u2007",
  nvap: "\u224D\u20D2",
  nvdash: "\u22AC",
  nvDash: "\u22AD",
  nVdash: "\u22AE",
  nVDash: "\u22AF",
  nvge: "\u2265\u20D2",
  nvgt: ">\u20D2",
  nvHarr: "\u2904",
  nvinfin: "\u29DE",
  nvlArr: "\u2902",
  nvle: "\u2264\u20D2",
  nvlt: "<\u20D2",
  nvltrie: "\u22B4\u20D2",
  nvrArr: "\u2903",
  nvrtrie: "\u22B5\u20D2",
  nvsim: "\u223C\u20D2",
  nwarhk: "\u2923",
  nwarr: "\u2196",
  nwArr: "\u21D6",
  nwarrow: "\u2196",
  nwnear: "\u2927",
  oacute: "\xF3",
  Oacute: "\xD3",
  oast: "\u229B",
  ocir: "\u229A",
  ocirc: "\xF4",
  Ocirc: "\xD4",
  ocy: "\u043E",
  Ocy: "\u041E",
  odash: "\u229D",
  odblac: "\u0151",
  Odblac: "\u0150",
  odiv: "\u2A38",
  odot: "\u2299",
  odsold: "\u29BC",
  oelig: "\u0153",
  OElig: "\u0152",
  ofcir: "\u29BF",
  ofr: "\u{1D52C}",
  Ofr: "\u{1D512}",
  ogon: "\u02DB",
  ograve: "\xF2",
  Ograve: "\xD2",
  ogt: "\u29C1",
  ohbar: "\u29B5",
  ohm: "\u03A9",
  oint: "\u222E",
  olarr: "\u21BA",
  olcir: "\u29BE",
  olcross: "\u29BB",
  oline: "\u203E",
  olt: "\u29C0",
  omacr: "\u014D",
  Omacr: "\u014C",
  omega: "\u03C9",
  Omega: "\u03A9",
  omicron: "\u03BF",
  Omicron: "\u039F",
  omid: "\u29B6",
  ominus: "\u2296",
  oopf: "\u{1D560}",
  Oopf: "\u{1D546}",
  opar: "\u29B7",
  OpenCurlyDoubleQuote: "\u201C",
  OpenCurlyQuote: "\u2018",
  operp: "\u29B9",
  oplus: "\u2295",
  or: "\u2228",
  Or: "\u2A54",
  orarr: "\u21BB",
  ord: "\u2A5D",
  order: "\u2134",
  orderof: "\u2134",
  ordf: "\xAA",
  ordm: "\xBA",
  origof: "\u22B6",
  oror: "\u2A56",
  orslope: "\u2A57",
  orv: "\u2A5B",
  oS: "\u24C8",
  oscr: "\u2134",
  Oscr: "\u{1D4AA}",
  oslash: "\xF8",
  Oslash: "\xD8",
  osol: "\u2298",
  otilde: "\xF5",
  Otilde: "\xD5",
  otimes: "\u2297",
  Otimes: "\u2A37",
  otimesas: "\u2A36",
  ouml: "\xF6",
  Ouml: "\xD6",
  ovbar: "\u233D",
  OverBar: "\u203E",
  OverBrace: "\u23DE",
  OverBracket: "\u23B4",
  OverParenthesis: "\u23DC",
  par: "\u2225",
  para: "\xB6",
  parallel: "\u2225",
  parsim: "\u2AF3",
  parsl: "\u2AFD",
  part: "\u2202",
  PartialD: "\u2202",
  pcy: "\u043F",
  Pcy: "\u041F",
  percnt: "%",
  period: ".",
  permil: "\u2030",
  perp: "\u22A5",
  pertenk: "\u2031",
  pfr: "\u{1D52D}",
  Pfr: "\u{1D513}",
  phi: "\u03C6",
  Phi: "\u03A6",
  phiv: "\u03D5",
  phmmat: "\u2133",
  phone: "\u260E",
  pi: "\u03C0",
  Pi: "\u03A0",
  pitchfork: "\u22D4",
  piv: "\u03D6",
  planck: "\u210F",
  planckh: "\u210E",
  plankv: "\u210F",
  plus: "+",
  plusacir: "\u2A23",
  plusb: "\u229E",
  pluscir: "\u2A22",
  plusdo: "\u2214",
  plusdu: "\u2A25",
  pluse: "\u2A72",
  PlusMinus: "\xB1",
  plusmn: "\xB1",
  plussim: "\u2A26",
  plustwo: "\u2A27",
  pm: "\xB1",
  Poincareplane: "\u210C",
  pointint: "\u2A15",
  popf: "\u{1D561}",
  Popf: "\u2119",
  pound: "\xA3",
  pr: "\u227A",
  Pr: "\u2ABB",
  prap: "\u2AB7",
  prcue: "\u227C",
  pre: "\u2AAF",
  prE: "\u2AB3",
  prec: "\u227A",
  precapprox: "\u2AB7",
  preccurlyeq: "\u227C",
  Precedes: "\u227A",
  PrecedesEqual: "\u2AAF",
  PrecedesSlantEqual: "\u227C",
  PrecedesTilde: "\u227E",
  preceq: "\u2AAF",
  precnapprox: "\u2AB9",
  precneqq: "\u2AB5",
  precnsim: "\u22E8",
  precsim: "\u227E",
  prime: "\u2032",
  Prime: "\u2033",
  primes: "\u2119",
  prnap: "\u2AB9",
  prnE: "\u2AB5",
  prnsim: "\u22E8",
  prod: "\u220F",
  Product: "\u220F",
  profalar: "\u232E",
  profline: "\u2312",
  profsurf: "\u2313",
  prop: "\u221D",
  Proportion: "\u2237",
  Proportional: "\u221D",
  propto: "\u221D",
  prsim: "\u227E",
  prurel: "\u22B0",
  pscr: "\u{1D4C5}",
  Pscr: "\u{1D4AB}",
  psi: "\u03C8",
  Psi: "\u03A8",
  puncsp: "\u2008",
  qfr: "\u{1D52E}",
  Qfr: "\u{1D514}",
  qint: "\u2A0C",
  qopf: "\u{1D562}",
  Qopf: "\u211A",
  qprime: "\u2057",
  qscr: "\u{1D4C6}",
  Qscr: "\u{1D4AC}",
  quaternions: "\u210D",
  quatint: "\u2A16",
  quest: "?",
  questeq: "\u225F",
  quot: '"',
  QUOT: '"',
  rAarr: "\u21DB",
  race: "\u223D\u0331",
  racute: "\u0155",
  Racute: "\u0154",
  radic: "\u221A",
  raemptyv: "\u29B3",
  rang: "\u27E9",
  Rang: "\u27EB",
  rangd: "\u2992",
  range: "\u29A5",
  rangle: "\u27E9",
  raquo: "\xBB",
  rarr: "\u2192",
  rArr: "\u21D2",
  Rarr: "\u21A0",
  rarrap: "\u2975",
  rarrb: "\u21E5",
  rarrbfs: "\u2920",
  rarrc: "\u2933",
  rarrfs: "\u291E",
  rarrhk: "\u21AA",
  rarrlp: "\u21AC",
  rarrpl: "\u2945",
  rarrsim: "\u2974",
  rarrtl: "\u21A3",
  Rarrtl: "\u2916",
  rarrw: "\u219D",
  ratail: "\u291A",
  rAtail: "\u291C",
  ratio: "\u2236",
  rationals: "\u211A",
  rbarr: "\u290D",
  rBarr: "\u290F",
  RBarr: "\u2910",
  rbbrk: "\u2773",
  rbrace: "}",
  rbrack: "]",
  rbrke: "\u298C",
  rbrksld: "\u298E",
  rbrkslu: "\u2990",
  rcaron: "\u0159",
  Rcaron: "\u0158",
  rcedil: "\u0157",
  Rcedil: "\u0156",
  rceil: "\u2309",
  rcub: "}",
  rcy: "\u0440",
  Rcy: "\u0420",
  rdca: "\u2937",
  rdldhar: "\u2969",
  rdquo: "\u201D",
  rdquor: "\u201D",
  rdsh: "\u21B3",
  Re: "\u211C",
  real: "\u211C",
  realine: "\u211B",
  realpart: "\u211C",
  reals: "\u211D",
  rect: "\u25AD",
  reg: "\xAE",
  REG: "\xAE",
  ReverseElement: "\u220B",
  ReverseEquilibrium: "\u21CB",
  ReverseUpEquilibrium: "\u296F",
  rfisht: "\u297D",
  rfloor: "\u230B",
  rfr: "\u{1D52F}",
  Rfr: "\u211C",
  rHar: "\u2964",
  rhard: "\u21C1",
  rharu: "\u21C0",
  rharul: "\u296C",
  rho: "\u03C1",
  Rho: "\u03A1",
  rhov: "\u03F1",
  RightAngleBracket: "\u27E9",
  rightarrow: "\u2192",
  Rightarrow: "\u21D2",
  RightArrow: "\u2192",
  RightArrowBar: "\u21E5",
  RightArrowLeftArrow: "\u21C4",
  rightarrowtail: "\u21A3",
  RightCeiling: "\u2309",
  RightDoubleBracket: "\u27E7",
  RightDownTeeVector: "\u295D",
  RightDownVector: "\u21C2",
  RightDownVectorBar: "\u2955",
  RightFloor: "\u230B",
  rightharpoondown: "\u21C1",
  rightharpoonup: "\u21C0",
  rightleftarrows: "\u21C4",
  rightleftharpoons: "\u21CC",
  rightrightarrows: "\u21C9",
  rightsquigarrow: "\u219D",
  RightTee: "\u22A2",
  RightTeeArrow: "\u21A6",
  RightTeeVector: "\u295B",
  rightthreetimes: "\u22CC",
  RightTriangle: "\u22B3",
  RightTriangleBar: "\u29D0",
  RightTriangleEqual: "\u22B5",
  RightUpDownVector: "\u294F",
  RightUpTeeVector: "\u295C",
  RightUpVector: "\u21BE",
  RightUpVectorBar: "\u2954",
  RightVector: "\u21C0",
  RightVectorBar: "\u2953",
  ring: "\u02DA",
  risingdotseq: "\u2253",
  rlarr: "\u21C4",
  rlhar: "\u21CC",
  rlm: "\u200F",
  rmoust: "\u23B1",
  rmoustache: "\u23B1",
  rnmid: "\u2AEE",
  roang: "\u27ED",
  roarr: "\u21FE",
  robrk: "\u27E7",
  ropar: "\u2986",
  ropf: "\u{1D563}",
  Ropf: "\u211D",
  roplus: "\u2A2E",
  rotimes: "\u2A35",
  RoundImplies: "\u2970",
  rpar: ")",
  rpargt: "\u2994",
  rppolint: "\u2A12",
  rrarr: "\u21C9",
  Rrightarrow: "\u21DB",
  rsaquo: "\u203A",
  rscr: "\u{1D4C7}",
  Rscr: "\u211B",
  rsh: "\u21B1",
  Rsh: "\u21B1",
  rsqb: "]",
  rsquo: "\u2019",
  rsquor: "\u2019",
  rthree: "\u22CC",
  rtimes: "\u22CA",
  rtri: "\u25B9",
  rtrie: "\u22B5",
  rtrif: "\u25B8",
  rtriltri: "\u29CE",
  RuleDelayed: "\u29F4",
  ruluhar: "\u2968",
  rx: "\u211E",
  sacute: "\u015B",
  Sacute: "\u015A",
  sbquo: "\u201A",
  sc: "\u227B",
  Sc: "\u2ABC",
  scap: "\u2AB8",
  scaron: "\u0161",
  Scaron: "\u0160",
  sccue: "\u227D",
  sce: "\u2AB0",
  scE: "\u2AB4",
  scedil: "\u015F",
  Scedil: "\u015E",
  scirc: "\u015D",
  Scirc: "\u015C",
  scnap: "\u2ABA",
  scnE: "\u2AB6",
  scnsim: "\u22E9",
  scpolint: "\u2A13",
  scsim: "\u227F",
  scy: "\u0441",
  Scy: "\u0421",
  sdot: "\u22C5",
  sdotb: "\u22A1",
  sdote: "\u2A66",
  searhk: "\u2925",
  searr: "\u2198",
  seArr: "\u21D8",
  searrow: "\u2198",
  sect: "\xA7",
  semi: ";",
  seswar: "\u2929",
  setminus: "\u2216",
  setmn: "\u2216",
  sext: "\u2736",
  sfr: "\u{1D530}",
  Sfr: "\u{1D516}",
  sfrown: "\u2322",
  sharp: "\u266F",
  shchcy: "\u0449",
  SHCHcy: "\u0429",
  shcy: "\u0448",
  SHcy: "\u0428",
  ShortDownArrow: "\u2193",
  ShortLeftArrow: "\u2190",
  shortmid: "\u2223",
  shortparallel: "\u2225",
  ShortRightArrow: "\u2192",
  ShortUpArrow: "\u2191",
  shy: "\xAD",
  sigma: "\u03C3",
  Sigma: "\u03A3",
  sigmaf: "\u03C2",
  sigmav: "\u03C2",
  sim: "\u223C",
  simdot: "\u2A6A",
  sime: "\u2243",
  simeq: "\u2243",
  simg: "\u2A9E",
  simgE: "\u2AA0",
  siml: "\u2A9D",
  simlE: "\u2A9F",
  simne: "\u2246",
  simplus: "\u2A24",
  simrarr: "\u2972",
  slarr: "\u2190",
  SmallCircle: "\u2218",
  smallsetminus: "\u2216",
  smashp: "\u2A33",
  smeparsl: "\u29E4",
  smid: "\u2223",
  smile: "\u2323",
  smt: "\u2AAA",
  smte: "\u2AAC",
  smtes: "\u2AAC\uFE00",
  softcy: "\u044C",
  SOFTcy: "\u042C",
  sol: "/",
  solb: "\u29C4",
  solbar: "\u233F",
  sopf: "\u{1D564}",
  Sopf: "\u{1D54A}",
  spades: "\u2660",
  spadesuit: "\u2660",
  spar: "\u2225",
  sqcap: "\u2293",
  sqcaps: "\u2293\uFE00",
  sqcup: "\u2294",
  sqcups: "\u2294\uFE00",
  Sqrt: "\u221A",
  sqsub: "\u228F",
  sqsube: "\u2291",
  sqsubset: "\u228F",
  sqsubseteq: "\u2291",
  sqsup: "\u2290",
  sqsupe: "\u2292",
  sqsupset: "\u2290",
  sqsupseteq: "\u2292",
  squ: "\u25A1",
  square: "\u25A1",
  Square: "\u25A1",
  SquareIntersection: "\u2293",
  SquareSubset: "\u228F",
  SquareSubsetEqual: "\u2291",
  SquareSuperset: "\u2290",
  SquareSupersetEqual: "\u2292",
  SquareUnion: "\u2294",
  squarf: "\u25AA",
  squf: "\u25AA",
  srarr: "\u2192",
  sscr: "\u{1D4C8}",
  Sscr: "\u{1D4AE}",
  ssetmn: "\u2216",
  ssmile: "\u2323",
  sstarf: "\u22C6",
  star: "\u2606",
  Star: "\u22C6",
  starf: "\u2605",
  straightepsilon: "\u03F5",
  straightphi: "\u03D5",
  strns: "\xAF",
  sub: "\u2282",
  Sub: "\u22D0",
  subdot: "\u2ABD",
  sube: "\u2286",
  subE: "\u2AC5",
  subedot: "\u2AC3",
  submult: "\u2AC1",
  subne: "\u228A",
  subnE: "\u2ACB",
  subplus: "\u2ABF",
  subrarr: "\u2979",
  subset: "\u2282",
  Subset: "\u22D0",
  subseteq: "\u2286",
  subseteqq: "\u2AC5",
  SubsetEqual: "\u2286",
  subsetneq: "\u228A",
  subsetneqq: "\u2ACB",
  subsim: "\u2AC7",
  subsub: "\u2AD5",
  subsup: "\u2AD3",
  succ: "\u227B",
  succapprox: "\u2AB8",
  succcurlyeq: "\u227D",
  Succeeds: "\u227B",
  SucceedsEqual: "\u2AB0",
  SucceedsSlantEqual: "\u227D",
  SucceedsTilde: "\u227F",
  succeq: "\u2AB0",
  succnapprox: "\u2ABA",
  succneqq: "\u2AB6",
  succnsim: "\u22E9",
  succsim: "\u227F",
  SuchThat: "\u220B",
  sum: "\u2211",
  Sum: "\u2211",
  sung: "\u266A",
  sup: "\u2283",
  Sup: "\u22D1",
  sup1: "\xB9",
  sup2: "\xB2",
  sup3: "\xB3",
  supdot: "\u2ABE",
  supdsub: "\u2AD8",
  supe: "\u2287",
  supE: "\u2AC6",
  supedot: "\u2AC4",
  Superset: "\u2283",
  SupersetEqual: "\u2287",
  suphsol: "\u27C9",
  suphsub: "\u2AD7",
  suplarr: "\u297B",
  supmult: "\u2AC2",
  supne: "\u228B",
  supnE: "\u2ACC",
  supplus: "\u2AC0",
  supset: "\u2283",
  Supset: "\u22D1",
  supseteq: "\u2287",
  supseteqq: "\u2AC6",
  supsetneq: "\u228B",
  supsetneqq: "\u2ACC",
  supsim: "\u2AC8",
  supsub: "\u2AD4",
  supsup: "\u2AD6",
  swarhk: "\u2926",
  swarr: "\u2199",
  swArr: "\u21D9",
  swarrow: "\u2199",
  swnwar: "\u292A",
  szlig: "\xDF",
  Tab: "	",
  target: "\u2316",
  tau: "\u03C4",
  Tau: "\u03A4",
  tbrk: "\u23B4",
  tcaron: "\u0165",
  Tcaron: "\u0164",
  tcedil: "\u0163",
  Tcedil: "\u0162",
  tcy: "\u0442",
  Tcy: "\u0422",
  tdot: "\u20DB",
  telrec: "\u2315",
  tfr: "\u{1D531}",
  Tfr: "\u{1D517}",
  there4: "\u2234",
  therefore: "\u2234",
  Therefore: "\u2234",
  theta: "\u03B8",
  Theta: "\u0398",
  thetasym: "\u03D1",
  thetav: "\u03D1",
  thickapprox: "\u2248",
  thicksim: "\u223C",
  ThickSpace: "\u205F\u200A",
  thinsp: "\u2009",
  ThinSpace: "\u2009",
  thkap: "\u2248",
  thksim: "\u223C",
  thorn: "\xFE",
  THORN: "\xDE",
  tilde: "\u02DC",
  Tilde: "\u223C",
  TildeEqual: "\u2243",
  TildeFullEqual: "\u2245",
  TildeTilde: "\u2248",
  times: "\xD7",
  timesb: "\u22A0",
  timesbar: "\u2A31",
  timesd: "\u2A30",
  tint: "\u222D",
  toea: "\u2928",
  top: "\u22A4",
  topbot: "\u2336",
  topcir: "\u2AF1",
  topf: "\u{1D565}",
  Topf: "\u{1D54B}",
  topfork: "\u2ADA",
  tosa: "\u2929",
  tprime: "\u2034",
  trade: "\u2122",
  TRADE: "\u2122",
  triangle: "\u25B5",
  triangledown: "\u25BF",
  triangleleft: "\u25C3",
  trianglelefteq: "\u22B4",
  triangleq: "\u225C",
  triangleright: "\u25B9",
  trianglerighteq: "\u22B5",
  tridot: "\u25EC",
  trie: "\u225C",
  triminus: "\u2A3A",
  TripleDot: "\u20DB",
  triplus: "\u2A39",
  trisb: "\u29CD",
  tritime: "\u2A3B",
  trpezium: "\u23E2",
  tscr: "\u{1D4C9}",
  Tscr: "\u{1D4AF}",
  tscy: "\u0446",
  TScy: "\u0426",
  tshcy: "\u045B",
  TSHcy: "\u040B",
  tstrok: "\u0167",
  Tstrok: "\u0166",
  twixt: "\u226C",
  twoheadleftarrow: "\u219E",
  twoheadrightarrow: "\u21A0",
  uacute: "\xFA",
  Uacute: "\xDA",
  uarr: "\u2191",
  uArr: "\u21D1",
  Uarr: "\u219F",
  Uarrocir: "\u2949",
  ubrcy: "\u045E",
  Ubrcy: "\u040E",
  ubreve: "\u016D",
  Ubreve: "\u016C",
  ucirc: "\xFB",
  Ucirc: "\xDB",
  ucy: "\u0443",
  Ucy: "\u0423",
  udarr: "\u21C5",
  udblac: "\u0171",
  Udblac: "\u0170",
  udhar: "\u296E",
  ufisht: "\u297E",
  ufr: "\u{1D532}",
  Ufr: "\u{1D518}",
  ugrave: "\xF9",
  Ugrave: "\xD9",
  uHar: "\u2963",
  uharl: "\u21BF",
  uharr: "\u21BE",
  uhblk: "\u2580",
  ulcorn: "\u231C",
  ulcorner: "\u231C",
  ulcrop: "\u230F",
  ultri: "\u25F8",
  umacr: "\u016B",
  Umacr: "\u016A",
  uml: "\xA8",
  UnderBar: "_",
  UnderBrace: "\u23DF",
  UnderBracket: "\u23B5",
  UnderParenthesis: "\u23DD",
  Union: "\u22C3",
  UnionPlus: "\u228E",
  uogon: "\u0173",
  Uogon: "\u0172",
  uopf: "\u{1D566}",
  Uopf: "\u{1D54C}",
  uparrow: "\u2191",
  Uparrow: "\u21D1",
  UpArrow: "\u2191",
  UpArrowBar: "\u2912",
  UpArrowDownArrow: "\u21C5",
  updownarrow: "\u2195",
  Updownarrow: "\u21D5",
  UpDownArrow: "\u2195",
  UpEquilibrium: "\u296E",
  upharpoonleft: "\u21BF",
  upharpoonright: "\u21BE",
  uplus: "\u228E",
  UpperLeftArrow: "\u2196",
  UpperRightArrow: "\u2197",
  upsi: "\u03C5",
  Upsi: "\u03D2",
  upsih: "\u03D2",
  upsilon: "\u03C5",
  Upsilon: "\u03A5",
  UpTee: "\u22A5",
  UpTeeArrow: "\u21A5",
  upuparrows: "\u21C8",
  urcorn: "\u231D",
  urcorner: "\u231D",
  urcrop: "\u230E",
  uring: "\u016F",
  Uring: "\u016E",
  urtri: "\u25F9",
  uscr: "\u{1D4CA}",
  Uscr: "\u{1D4B0}",
  utdot: "\u22F0",
  utilde: "\u0169",
  Utilde: "\u0168",
  utri: "\u25B5",
  utrif: "\u25B4",
  uuarr: "\u21C8",
  uuml: "\xFC",
  Uuml: "\xDC",
  uwangle: "\u29A7",
  vangrt: "\u299C",
  varepsilon: "\u03F5",
  varkappa: "\u03F0",
  varnothing: "\u2205",
  varphi: "\u03D5",
  varpi: "\u03D6",
  varpropto: "\u221D",
  varr: "\u2195",
  vArr: "\u21D5",
  varrho: "\u03F1",
  varsigma: "\u03C2",
  varsubsetneq: "\u228A\uFE00",
  varsubsetneqq: "\u2ACB\uFE00",
  varsupsetneq: "\u228B\uFE00",
  varsupsetneqq: "\u2ACC\uFE00",
  vartheta: "\u03D1",
  vartriangleleft: "\u22B2",
  vartriangleright: "\u22B3",
  vBar: "\u2AE8",
  Vbar: "\u2AEB",
  vBarv: "\u2AE9",
  vcy: "\u0432",
  Vcy: "\u0412",
  vdash: "\u22A2",
  vDash: "\u22A8",
  Vdash: "\u22A9",
  VDash: "\u22AB",
  Vdashl: "\u2AE6",
  vee: "\u2228",
  Vee: "\u22C1",
  veebar: "\u22BB",
  veeeq: "\u225A",
  vellip: "\u22EE",
  verbar: "|",
  Verbar: "\u2016",
  vert: "|",
  Vert: "\u2016",
  VerticalBar: "\u2223",
  VerticalLine: "|",
  VerticalSeparator: "\u2758",
  VerticalTilde: "\u2240",
  VeryThinSpace: "\u200A",
  vfr: "\u{1D533}",
  Vfr: "\u{1D519}",
  vltri: "\u22B2",
  vnsub: "\u2282\u20D2",
  vnsup: "\u2283\u20D2",
  vopf: "\u{1D567}",
  Vopf: "\u{1D54D}",
  vprop: "\u221D",
  vrtri: "\u22B3",
  vscr: "\u{1D4CB}",
  Vscr: "\u{1D4B1}",
  vsubne: "\u228A\uFE00",
  vsubnE: "\u2ACB\uFE00",
  vsupne: "\u228B\uFE00",
  vsupnE: "\u2ACC\uFE00",
  Vvdash: "\u22AA",
  vzigzag: "\u299A",
  wcirc: "\u0175",
  Wcirc: "\u0174",
  wedbar: "\u2A5F",
  wedge: "\u2227",
  Wedge: "\u22C0",
  wedgeq: "\u2259",
  weierp: "\u2118",
  wfr: "\u{1D534}",
  Wfr: "\u{1D51A}",
  wopf: "\u{1D568}",
  Wopf: "\u{1D54E}",
  wp: "\u2118",
  wr: "\u2240",
  wreath: "\u2240",
  wscr: "\u{1D4CC}",
  Wscr: "\u{1D4B2}",
  xcap: "\u22C2",
  xcirc: "\u25EF",
  xcup: "\u22C3",
  xdtri: "\u25BD",
  xfr: "\u{1D535}",
  Xfr: "\u{1D51B}",
  xharr: "\u27F7",
  xhArr: "\u27FA",
  xi: "\u03BE",
  Xi: "\u039E",
  xlarr: "\u27F5",
  xlArr: "\u27F8",
  xmap: "\u27FC",
  xnis: "\u22FB",
  xodot: "\u2A00",
  xopf: "\u{1D569}",
  Xopf: "\u{1D54F}",
  xoplus: "\u2A01",
  xotime: "\u2A02",
  xrarr: "\u27F6",
  xrArr: "\u27F9",
  xscr: "\u{1D4CD}",
  Xscr: "\u{1D4B3}",
  xsqcup: "\u2A06",
  xuplus: "\u2A04",
  xutri: "\u25B3",
  xvee: "\u22C1",
  xwedge: "\u22C0",
  yacute: "\xFD",
  Yacute: "\xDD",
  yacy: "\u044F",
  YAcy: "\u042F",
  ycirc: "\u0177",
  Ycirc: "\u0176",
  ycy: "\u044B",
  Ycy: "\u042B",
  yen: "\xA5",
  yfr: "\u{1D536}",
  Yfr: "\u{1D51C}",
  yicy: "\u0457",
  YIcy: "\u0407",
  yopf: "\u{1D56A}",
  Yopf: "\u{1D550}",
  yscr: "\u{1D4CE}",
  Yscr: "\u{1D4B4}",
  yucy: "\u044E",
  YUcy: "\u042E",
  yuml: "\xFF",
  Yuml: "\u0178",
  zacute: "\u017A",
  Zacute: "\u0179",
  zcaron: "\u017E",
  Zcaron: "\u017D",
  zcy: "\u0437",
  Zcy: "\u0417",
  zdot: "\u017C",
  Zdot: "\u017B",
  zeetrf: "\u2128",
  ZeroWidthSpace: "\u200B",
  zeta: "\u03B6",
  Zeta: "\u0396",
  zfr: "\u{1D537}",
  Zfr: "\u2128",
  zhcy: "\u0436",
  ZHcy: "\u0416",
  zigrarr: "\u21DD",
  zopf: "\u{1D56B}",
  Zopf: "\u2124",
  zscr: "\u{1D4CF}",
  Zscr: "\u{1D4B5}",
  zwj: "\u200D",
  zwnj: "\u200C"
};
var decodeMapLegacy = {
  aacute: "\xE1",
  Aacute: "\xC1",
  acirc: "\xE2",
  Acirc: "\xC2",
  acute: "\xB4",
  aelig: "\xE6",
  AElig: "\xC6",
  agrave: "\xE0",
  Agrave: "\xC0",
  amp: "&",
  AMP: "&",
  aring: "\xE5",
  Aring: "\xC5",
  atilde: "\xE3",
  Atilde: "\xC3",
  auml: "\xE4",
  Auml: "\xC4",
  brvbar: "\xA6",
  ccedil: "\xE7",
  Ccedil: "\xC7",
  cedil: "\xB8",
  cent: "\xA2",
  copy: "\xA9",
  COPY: "\xA9",
  curren: "\xA4",
  deg: "\xB0",
  divide: "\xF7",
  eacute: "\xE9",
  Eacute: "\xC9",
  ecirc: "\xEA",
  Ecirc: "\xCA",
  egrave: "\xE8",
  Egrave: "\xC8",
  eth: "\xF0",
  ETH: "\xD0",
  euml: "\xEB",
  Euml: "\xCB",
  frac12: "\xBD",
  frac14: "\xBC",
  frac34: "\xBE",
  gt: ">",
  GT: ">",
  iacute: "\xED",
  Iacute: "\xCD",
  icirc: "\xEE",
  Icirc: "\xCE",
  iexcl: "\xA1",
  igrave: "\xEC",
  Igrave: "\xCC",
  iquest: "\xBF",
  iuml: "\xEF",
  Iuml: "\xCF",
  laquo: "\xAB",
  lt: "<",
  LT: "<",
  macr: "\xAF",
  micro: "\xB5",
  middot: "\xB7",
  nbsp: "\xA0",
  not: "\xAC",
  ntilde: "\xF1",
  Ntilde: "\xD1",
  oacute: "\xF3",
  Oacute: "\xD3",
  ocirc: "\xF4",
  Ocirc: "\xD4",
  ograve: "\xF2",
  Ograve: "\xD2",
  ordf: "\xAA",
  ordm: "\xBA",
  oslash: "\xF8",
  Oslash: "\xD8",
  otilde: "\xF5",
  Otilde: "\xD5",
  ouml: "\xF6",
  Ouml: "\xD6",
  para: "\xB6",
  plusmn: "\xB1",
  pound: "\xA3",
  quot: '"',
  QUOT: '"',
  raquo: "\xBB",
  reg: "\xAE",
  REG: "\xAE",
  sect: "\xA7",
  shy: "\xAD",
  sup1: "\xB9",
  sup2: "\xB2",
  sup3: "\xB3",
  szlig: "\xDF",
  thorn: "\xFE",
  THORN: "\xDE",
  times: "\xD7",
  uacute: "\xFA",
  Uacute: "\xDA",
  ucirc: "\xFB",
  Ucirc: "\xDB",
  ugrave: "\xF9",
  Ugrave: "\xD9",
  uml: "\xA8",
  uuml: "\xFC",
  Uuml: "\xDC",
  yacute: "\xFD",
  Yacute: "\xDD",
  yen: "\xA5",
  yuml: "\xFF"
};
var decodeMapNumeric = {
  "0": "\uFFFD",
  "128": "\u20AC",
  "130": "\u201A",
  "131": "\u0192",
  "132": "\u201E",
  "133": "\u2026",
  "134": "\u2020",
  "135": "\u2021",
  "136": "\u02C6",
  "137": "\u2030",
  "138": "\u0160",
  "139": "\u2039",
  "140": "\u0152",
  "142": "\u017D",
  "145": "\u2018",
  "146": "\u2019",
  "147": "\u201C",
  "148": "\u201D",
  "149": "\u2022",
  "150": "\u2013",
  "151": "\u2014",
  "152": "\u02DC",
  "153": "\u2122",
  "154": "\u0161",
  "155": "\u203A",
  "156": "\u0153",
  "158": "\u017E",
  "159": "\u0178"
};
var invalidReferenceCodePoints = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  11,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  127,
  128,
  129,
  130,
  131,
  132,
  133,
  134,
  135,
  136,
  137,
  138,
  139,
  140,
  141,
  142,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  150,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
  64976,
  64977,
  64978,
  64979,
  64980,
  64981,
  64982,
  64983,
  64984,
  64985,
  64986,
  64987,
  64988,
  64989,
  64990,
  64991,
  64992,
  64993,
  64994,
  64995,
  64996,
  64997,
  64998,
  64999,
  65e3,
  65001,
  65002,
  65003,
  65004,
  65005,
  65006,
  65007,
  65534,
  65535,
  131070,
  131071,
  196606,
  196607,
  262142,
  262143,
  327678,
  327679,
  393214,
  393215,
  458750,
  458751,
  524286,
  524287,
  589822,
  589823,
  655358,
  655359,
  720894,
  720895,
  786430,
  786431,
  851966,
  851967,
  917502,
  917503,
  983038,
  983039,
  1048574,
  1048575,
  1114110,
  1114111
];
var stringFromCharCode = String.fromCharCode;
var object = {};
var hasOwnProperty = object.hasOwnProperty;
var has = function(object2, propertyName) {
  return hasOwnProperty.call(object2, propertyName);
};
var contains = function(array, value) {
  var index = -1;
  var length = array.length;
  while (++index < length) {
    if (array[index] == value) {
      return true;
    }
  }
  return false;
};
var merge = function(options, defaults) {
  if (!options) {
    return defaults;
  }
  var result = {};
  var key;
  for (key in defaults) {
    result[key] = has(options, key) ? options[key] : defaults[key];
  }
  return result;
};
var codePointToSymbol = function(codePoint, strict) {
  var output = "";
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    if (strict) {
      parseError("character reference outside the permissible Unicode range");
    }
    return "\uFFFD";
  }
  if (has(decodeMapNumeric, codePoint)) {
    if (strict) {
      parseError("disallowed character reference");
    }
    return decodeMapNumeric[codePoint];
  }
  if (strict && contains(invalidReferenceCodePoints, codePoint)) {
    parseError("disallowed character reference");
  }
  if (codePoint > 65535) {
    codePoint -= 65536;
    output += stringFromCharCode(codePoint >>> 10 & 1023 | 55296);
    codePoint = 56320 | codePoint & 1023;
  }
  output += stringFromCharCode(codePoint);
  return output;
};
var hexEscape = function(codePoint) {
  return "&#x" + codePoint.toString(16).toUpperCase() + ";";
};
var decEscape = function(codePoint) {
  return "&#" + codePoint + ";";
};
var parseError = function(message) {
  throw Error("Parse error: " + message);
};
var encode = function(string, options) {
  options = merge(options, encode.options);
  var strict = options.strict;
  if (strict && regexInvalidRawCodePoint.test(string)) {
    parseError("forbidden code point");
  }
  var encodeEverything = options.encodeEverything;
  var useNamedReferences = options.useNamedReferences;
  var allowUnsafeSymbols = options.allowUnsafeSymbols;
  var escapeCodePoint = options.decimal ? decEscape : hexEscape;
  var escapeBmpSymbol = function(symbol) {
    return escapeCodePoint(symbol.charCodeAt(0));
  };
  if (encodeEverything) {
    string = string.replace(regexAsciiWhitelist, function(symbol) {
      if (useNamedReferences && has(encodeMap, symbol)) {
        return "&" + encodeMap[symbol] + ";";
      }
      return escapeBmpSymbol(symbol);
    });
    if (useNamedReferences) {
      string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;").replace(/&#x66;&#x6A;/g, "&fjlig;");
    }
    if (useNamedReferences) {
      string = string.replace(regexEncodeNonAscii, function(string2) {
        return "&" + encodeMap[string2] + ";";
      });
    }
  } else if (useNamedReferences) {
    if (!allowUnsafeSymbols) {
      string = string.replace(regexEscape, function(string2) {
        return "&" + encodeMap[string2] + ";";
      });
    }
    string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;");
    string = string.replace(regexEncodeNonAscii, function(string2) {
      return "&" + encodeMap[string2] + ";";
    });
  } else if (!allowUnsafeSymbols) {
    string = string.replace(regexEscape, escapeBmpSymbol);
  }
  return string.replace(regexAstralSymbols, function($0) {
    var high = $0.charCodeAt(0);
    var low = $0.charCodeAt(1);
    var codePoint = (high - 55296) * 1024 + low - 56320 + 65536;
    return escapeCodePoint(codePoint);
  }).replace(regexBmpWhitelist, escapeBmpSymbol);
};
encode.options = {
  allowUnsafeSymbols: false,
  encodeEverything: false,
  strict: false,
  useNamedReferences: false,
  decimal: false
};
var decode = function(html2, options) {
  options = merge(options, decode.options);
  var strict = options.strict;
  if (strict && regexInvalidEntity.test(html2)) {
    parseError("malformed character reference");
  }
  return html2.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
    var codePoint;
    var semicolon;
    var decDigits;
    var hexDigits;
    var reference;
    var next;
    if ($1) {
      reference = $1;
      return decodeMap[reference];
    }
    if ($2) {
      reference = $2;
      next = $3;
      if (next && options.isAttributeValue) {
        if (strict && next == "=") {
          parseError("`&` did not start a character reference");
        }
        return $0;
      } else {
        if (strict) {
          parseError("named character reference was not terminated by a semicolon");
        }
        return decodeMapLegacy[reference] + (next || "");
      }
    }
    if ($4) {
      decDigits = $4;
      semicolon = $5;
      if (strict && !semicolon) {
        parseError("character reference was not terminated by a semicolon");
      }
      codePoint = parseInt(decDigits, 10);
      return codePointToSymbol(codePoint, strict);
    }
    if ($6) {
      hexDigits = $6;
      semicolon = $7;
      if (strict && !semicolon) {
        parseError("character reference was not terminated by a semicolon");
      }
      codePoint = parseInt(hexDigits, 16);
      return codePointToSymbol(codePoint, strict);
    }
    if (strict) {
      parseError("named character reference was not terminated by a semicolon");
    }
    return $0;
  });
};
decode.options = {
  isAttributeValue: false,
  strict: false
};

// src/encoding.ts
var escapeHTML = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
var unescapeHTML = (html2) => decode(html2);

// src/h.ts
function _h(context, tag, attrs, children) {
  if (typeof tag === "function") {
    return tag.call(null, {
      props: { ...attrs, children },
      attrs,
      children,
      h: context.h,
      context
    });
  } else {
    let el;
    if (tag) {
      if (tag.toLowerCase() === "fragment") {
        el = context.document.createDocumentFragment();
      } else {
        el = context.document.createElement(tag);
      }
    } else {
      el = context.document.createElement("div");
    }
    if (attrs) {
      for (let [key, value] of Object.entries(attrs)) {
        key = key.toString();
        const compareKey = key.toLowerCase();
        if (compareKey === "classname") {
          el.className = value;
        } else if (compareKey === "on") {
          Object.entries(value).forEach(([name, value2]) => {
            el.setAttribute("on" + name, value2);
          });
        } else if (value !== false && value != null) {
          if (value === true) {
            el.setAttribute(key, key);
          } else {
            el.setAttribute(key, value.toString());
          }
        }
      }
    }
    if (children) {
      for (const childOuter of children) {
        let cc = Array.isArray(childOuter) ? [...childOuter] : [childOuter];
        for (let child of cc) {
          if (child) {
            if (child !== false && child != null) {
              if (typeof child !== "object") {
                el.appendChild(context.document.createTextNode(child.toString()));
              } else {
                el.appendChild(child);
              }
            }
          }
        }
      }
    }
    return el;
  }
}
function hArgumentParser(tag, attrs, ...children) {
  if (typeof tag === "object") {
    tag = "fragment";
    children = tag.children;
    attrs = tag.attrs;
  }
  if (Array.isArray(attrs)) {
    children = [attrs];
    attrs = {};
  } else if (attrs) {
    if (attrs.attrs) {
      attrs = { ...attrs.attrs, ...attrs };
      delete attrs.attrs;
    }
  } else {
    attrs = {};
  }
  return {
    tag,
    attrs,
    children: typeof children[0] === "string" ? children : children.flat(Infinity)
  };
}
function hFactory(context) {
  context.h = function h2(itag, iattrs, ...ichildren) {
    let { tag, attrs, children } = hArgumentParser(itag, iattrs, ichildren);
    return _h(context, tag, attrs, children);
  };
  return context.h;
}

// src/html.ts
var SELF_CLOSING_TAGS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
  "command"
];
var CDATA = (s) => "<![CDATA[" + s + "]]>";
function markup(xmlMode, tag, attrs = {}, children) {
  const hasChildren = !(typeof children === "string" && children === "" || Array.isArray(children) && (children.length === 0 || children.length === 1 && children[0] === "") || children == null);
  let parts = [];
  tag = tag.replace(/__/g, ":");
  if (tag !== "noop" && tag !== "") {
    if (tag !== "cdata") {
      parts.push(`<${tag}`);
    } else {
      parts.push("<![CDATA[");
    }
    for (let name in attrs) {
      if (name && attrs.hasOwnProperty(name)) {
        let v = attrs[name];
        if (name === "html") {
          continue;
        }
        if (name.toLowerCase() === "classname") {
          name = "class";
        }
        name = name.replace(/__/g, ":");
        if (v === true) {
          parts.push(` ${name}`);
        } else if (name === "style" && typeof v === "object") {
          parts.push(` ${name}="${Object.keys(v).filter((k) => v[k] != null).map((k) => {
            let vv = v[k];
            vv = typeof vv === "number" ? vv + "px" : vv;
            return `${k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${vv}`;
          }).join(";")}"`);
        } else if (v !== false && v != null) {
          parts.push(` ${name}="${escapeHTML(v.toString())}"`);
        }
      }
    }
    if (tag !== "cdata") {
      if (xmlMode && !hasChildren) {
        parts.push(" />");
        return parts.join("");
      } else {
        parts.push(">");
      }
    }
    if (!xmlMode && SELF_CLOSING_TAGS.includes(tag)) {
      return parts.join("");
    }
  }
  if (hasChildren) {
    if (typeof children === "string") {
      parts.push(children);
    } else if (children && children.length > 0) {
      for (let child of children) {
        if (child != null && child !== false) {
          if (!Array.isArray(child)) {
            child = [child];
          }
          for (let c of child) {
            if (c.startsWith("<") && c.endsWith(">") || tag === "script" || tag === "style") {
              parts.push(c);
            } else {
              parts.push(escapeHTML(c.toString()));
            }
          }
        }
      }
    }
  }
  if (attrs.html) {
    parts.push(attrs.html);
  }
  if (tag !== "noop" && tag !== "") {
    if (tag !== "cdata") {
      parts.push(`</${tag}>`);
    } else {
      parts.push("]]>");
    }
  }
  return parts.join("");
}
function html(itag, iattrs, ...ichildren) {
  let { tag, attrs, children } = hArgumentParser(itag, iattrs, ichildren);
  return markup(false, tag, attrs, children);
}
var htmlVDOM = markup.bind(null, false);
html.firstLine = "<!DOCTYPE html>";
html.html = true;

// src/vcss.ts
import { parse } from "css-what";
var cache = {};
function parseSelector(selector) {
  let ast = cache[selector];
  if (ast == null) {
    ast = parse(selector);
    cache[selector] = ast;
  }
  return ast;
}
function matchSelector(selector, element, { debug = false } = {}) {
  for (let rules of parseSelector(selector)) {
    if (debug) {
      console.log("Selector:", selector);
      console.log("Rules:", rules);
      console.log("Element:", element);
    }
    const handleRules = (element2, rules2) => {
      var _a, _b, _c;
      let success = false;
      for (let part of rules2) {
        const { type, name, action, value, ignoreCase = true, data } = part;
        if (type === "attribute") {
          if (action === "equals") {
            success = element2.getAttribute(name) === value;
            if (debug)
              console.log("Attribute equals", success);
          } else if (action === "start") {
            success = !!((_a = element2.getAttribute(name)) == null ? void 0 : _a.startsWith(value));
            if (debug)
              console.log("Attribute start", success);
          } else if (action === "end") {
            success = !!((_b = element2.getAttribute(name)) == null ? void 0 : _b.endsWith(value));
            if (debug)
              console.log("Attribute start", success);
          } else if (action === "element") {
            if (name === "class") {
              success = element2.classList.contains(value);
              if (debug)
                console.log("Attribute class", success);
            } else {
              success = !!((_c = element2.getAttribute(name)) == null ? void 0 : _c.includes(value));
              if (debug)
                console.log("Attribute element", success);
            }
          } else if (action === "exists") {
            success = element2.hasAttribute(name);
            if (debug)
              console.log("Attribute exists", success);
          } else {
            console.warn("Unknown CSS selector action", action);
          }
        } else if (type === "tag") {
          success = element2.tagName === name.toUpperCase();
          if (debug)
            console.log("Is tag", success);
        } else if (type === "universal") {
          success = true;
          if (debug)
            console.log("Is universal", success);
        } else if (type === "pseudo") {
          if (name === "not") {
            let ok = true;
            data.forEach((rules3) => {
              if (!handleRules(element2, rules3)) {
                ok = false;
              }
            });
            success = !ok;
          }
          if (debug)
            console.log("Is :not", success);
        } else {
          console.warn("Unknown CSS selector type", type, selector, rules2);
        }
        if (!success)
          break;
      }
      return success;
    };
    if (handleRules(element, rules)) {
      return true;
    }
  }
  return false;
}

// src/vdom.ts
var inspect = Symbol.for("nodejs.util.inspect.custom");
var B = { fontWeight: "bold" };
var I = { fontStyle: "italic" };
var M = { backgroundColor: "rgb(255, 250, 165)" };
var U = { textDecorations: "underline" };
var S = { textDecorations: "line-through" };
var DEFAULTS = {
  b: B,
  strong: B,
  em: I,
  i: I,
  mark: M,
  u: U,
  a: U,
  s: S,
  del: S,
  ins: M,
  strike: S
};
var toCamelCase = (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
var _VNode = class {
  constructor() {
    this.append = this.appendChild;
    this._parentNode = null;
    this._childNodes = [];
  }
  get nodeType() {
    console.error("Subclasses should define nodeType!");
    return 0;
  }
  get nodeName() {
    console.error("Subclasses should define nodeName!");
    return "";
  }
  get nodeValue() {
    return null;
  }
  cloneNode(deep = false) {
    let node = new this.constructor();
    if (deep) {
      node._childNodes = this._childNodes.map((c) => c.cloneNode(true));
      node._fixChildNodesParent();
    }
    return node;
  }
  _fixChildNodesParent() {
    this._childNodes.forEach((node) => node._parentNode = this);
  }
  insertBefore(newNode, node) {
    if (newNode !== node) {
      let index = node ? this._childNodes.indexOf(node) : 0;
      if (index < 0)
        index = 0;
      this._childNodes.splice(index, 0, newNode);
      this._fixChildNodesParent();
    }
  }
  appendChild(node) {
    if (node == null)
      return;
    if (node === this) {
      console.warn("Cannot appendChild to self");
      return;
    }
    if (node instanceof VDocument) {
      console.warn("No defined how to append a document to a node!", node);
    }
    if (node instanceof VDocumentFragment) {
      for (let c of [...node._childNodes]) {
        this.appendChild(c);
      }
    } else if (Array.isArray(node)) {
      for (let c of [...node]) {
        this.appendChild(c);
      }
    } else if (node instanceof _VNode) {
      node.remove();
      this._childNodes.push(node);
    } else {
      try {
        const text = typeof node === "string" ? node : JSON.stringify(node, null, 2);
        this._childNodes.push(new VTextNode(text));
      } catch (err) {
        console.error(`The data ${node} to be added to ${this.render()} is problematic: ${err}`);
      }
    }
    this._fixChildNodesParent();
  }
  removeChild(node) {
    let i = this._childNodes.indexOf(node);
    if (i >= 0) {
      node._parentNode = null;
      this._childNodes.splice(i, 1);
      this._fixChildNodesParent();
    }
  }
  remove() {
    var _a;
    (_a = this == null ? void 0 : this.parentNode) == null ? void 0 : _a.removeChild(this);
    return this;
  }
  replaceChildren(...nodes) {
    this._childNodes = nodes.map((n) => typeof n === "string" ? new VTextNode(n) : n.remove());
    this._fixChildNodesParent();
  }
  replaceWith(...nodes) {
    let p = this._parentNode;
    if (p) {
      let index = this._indexInParent();
      if (index >= 0) {
        nodes = nodes.map((n) => typeof n === "string" ? new VTextNode(n) : n.remove());
        p._childNodes.splice(index, 1, ...nodes);
        this._parentNode = null;
        p._fixChildNodesParent();
      }
    }
  }
  _indexInParent() {
    if (this._parentNode) {
      return this._parentNode.childNodes.indexOf(this);
    }
    return -1;
  }
  get parentNode() {
    return this._parentNode;
  }
  get childNodes() {
    return this._childNodes || [];
  }
  get children() {
    return this._childNodes || [];
  }
  get firstChild() {
    return this._childNodes[0];
  }
  get lastChild() {
    return this._childNodes[this._childNodes.length - 1];
  }
  get nextSibling() {
    let i = this._indexInParent();
    if (i != null) {
      return this.parentNode.childNodes[i + 1] || null;
    }
    return null;
  }
  get previousSibling() {
    let i = this._indexInParent();
    if (i > 0) {
      return this.parentNode.childNodes[i - 1] || null;
    }
    return null;
  }
  flatten() {
    let elements = [];
    if (this instanceof VElement) {
      elements.push(this);
    }
    for (let child of this._childNodes) {
      elements.push(...child.flatten());
    }
    return elements;
  }
  flattenNodes() {
    let nodes = [];
    nodes.push(this);
    for (let child of this._childNodes) {
      nodes.push(...child.flattenNodes());
    }
    return nodes;
  }
  render() {
    return "";
  }
  get textContent() {
    return this._childNodes.map((c) => c.textContent).join("");
  }
  set textContent(text) {
    this._childNodes = [];
    if (text) {
      this.appendChild(new VTextNode(text.toString()));
    }
  }
  contains(otherNode) {
    if (otherNode === this)
      return true;
    return this._childNodes.some((n) => n.contains(otherNode));
  }
  get ownerDocument() {
    var _a;
    if (this.nodeType === _VNode.DOCUMENT_NODE || this.nodeType === _VNode.DOCUMENT_FRAGMENT_NODE) {
      return this;
    }
    return (_a = this == null ? void 0 : this._parentNode) == null ? void 0 : _a.ownerDocument;
  }
  toString() {
    return `${this.nodeName}`;
  }
  [inspect]() {
    return `${this.constructor.name} "${this.render()}"`;
  }
};
var VNode = _VNode;
VNode.ELEMENT_NODE = 1;
VNode.TEXT_NODE = 3;
VNode.CDATA_SECTION_NODE = 4;
VNode.PROCESSING_INSTRUCTION_NODE = 7;
VNode.COMMENT_NODE = 8;
VNode.DOCUMENT_NODE = 9;
VNode.DOCUMENT_TYPE_NODE = 10;
VNode.DOCUMENT_FRAGMENT_NODE = 11;
var VTextNode = class extends VNode {
  constructor(text = "") {
    super();
    this._text = text;
  }
  get nodeType() {
    return VNode.TEXT_NODE;
  }
  get nodeName() {
    return "#text";
  }
  get nodeValue() {
    return this._text || "";
  }
  get textContent() {
    return this.nodeValue;
  }
  render() {
    var _a;
    const parentTagName = (_a = this.parentNode) == null ? void 0 : _a.tagName;
    if (parentTagName === "SCRIPT" || parentTagName === "STYLE") {
      return this._text;
    }
    return escapeHTML(this._text);
  }
  cloneNode(deep = false) {
    let node = super.cloneNode(deep);
    node._text = this._text;
    return node;
  }
};
var VNodeQuery = class extends VNode {
  getElementById(name) {
    return this.flatten().find((e) => e._attributes["id"] === name);
  }
  getElementsByClassName(name) {
    return this.flatten().filter((e) => e.classList.contains(name));
  }
  matches(selector) {
    return matchSelector(selector, this);
  }
  querySelectorAll(selector) {
    return this.flatten().filter((e) => e.matches(selector));
  }
  querySelector(selector) {
    return this.flatten().find((e) => e.matches(selector));
  }
  parent(selector) {
    var _a;
    if (this.matches(selector)) {
      return this;
    }
    if (this.parentNode == null) {
      return null;
    }
    return (_a = this.parentNode) == null ? void 0 : _a.parent(selector);
  }
  handle(selector, handler) {
    let i = 0;
    for (let el of this.querySelectorAll(selector)) {
      handler(el, i++);
    }
  }
};
var VElement = class extends VNodeQuery {
  constructor(name = "div", attrs = {}) {
    super();
    this._originalTagName = name;
    this._nodeName = (name || "").toUpperCase();
    this._attributes = attrs || {};
    this._styles = null;
  }
  get nodeType() {
    return VNode.ELEMENT_NODE;
  }
  get nodeName() {
    return this._nodeName;
  }
  cloneNode(deep = false) {
    let node = super.cloneNode(deep);
    node._originalTagName = this._originalTagName;
    node._nodeName = this._nodeName;
    node._attributes = Object.assign({}, this._attributes);
    return node;
  }
  get attributes() {
    return this._attributes;
  }
  _findAttributeName(name) {
    const search = name.toLowerCase();
    return Object.keys(this._attributes).find((name2) => search === name2.toLowerCase()) || null;
  }
  setAttribute(name, value) {
    this.removeAttribute(name);
    this._attributes[name] = value;
    this._styles = null;
  }
  getAttribute(name) {
    const originalName = this._findAttributeName(name);
    return originalName ? this._attributes[originalName] : null;
  }
  removeAttribute(name) {
    const originalName = this._findAttributeName(String(name));
    if (originalName) {
      delete this._attributes[name];
    }
  }
  hasAttribute(name) {
    const originalName = this._findAttributeName(name);
    return originalName ? this._attributes[originalName] != null : false;
  }
  get style() {
    if (this._styles == null) {
      let styles = Object.assign({}, DEFAULTS[this.tagName.toLowerCase()] || {});
      let styleString = this.getAttribute("style");
      if (styleString) {
        let m;
        let re = /\s*([\w-]+)\s*:\s*([^;]+)/g;
        while (m = re.exec(styleString)) {
          let name = m[1];
          let value = m[2].trim();
          styles[name] = value;
          styles[toCamelCase(name)] = value;
        }
      }
      this._styles = styles;
    }
    return this._styles;
  }
  get tagName() {
    return this._nodeName;
  }
  get id() {
    return this._attributes.id || null;
  }
  set id(value) {
    if (value == null)
      delete this._attributes.id;
    else
      this._attributes.id = value;
  }
  get src() {
    return this._attributes.src;
  }
  set src(value) {
    if (value == null)
      delete this._attributes.src;
    else
      this._attributes.src = value;
  }
  getElementsByTagName(name) {
    name = name.toUpperCase();
    let elements = this.flatten();
    if (name !== "*") {
      return elements.filter((e) => e.tagName === name);
    }
    return elements;
  }
  setInnerHTML(html2) {
    throw "setInnerHTML is not implemented; see vdomparser for an example";
  }
  get innerHTML() {
    return this._childNodes.map((c) => c.render(html)).join("");
  }
  set innerHTML(html2) {
    this.setInnerHTML(html2);
  }
  get outerHTML() {
    return this.render(htmlVDOM);
  }
  get className() {
    return this._attributes["class"] || "";
  }
  set className(name) {
    if (Array.isArray(name)) {
      name = name.filter((n) => !!n).join(" ");
    } else if (typeof name === "object") {
      name = Object.entries(name).filter(([k, v]) => !!v).map(([k, v]) => k).join(" ");
    }
    this._attributes["class"] = name;
  }
  get classList() {
    let self = this;
    let classNames = (this.className || "").trim().split(/\s+/g) || [];
    return {
      contains(s) {
        return classNames.includes(s);
      },
      add(s) {
        if (!classNames.includes(s)) {
          classNames.push(s);
          self.className = classNames;
        }
      },
      remove(s) {
        let index = classNames.indexOf(s);
        if (index >= 0) {
          classNames.splice(index, 1);
          self.className = classNames;
        }
      }
    };
  }
  render(h2 = htmlVDOM) {
    return h2(this._originalTagName || this.tagName, this.attributes, this._childNodes.map((c) => c.render(h2)).join(""));
  }
};
var VDocType = class extends VNode {
  get nodeName() {
    return super.nodeName;
  }
  get nodeValue() {
    return super.nodeValue;
  }
  get nodeType() {
    return VDocType.DOCUMENT_TYPE_NODE;
  }
  render() {
    return `<!DOCTYPE html>`;
  }
};
var VDocumentFragment = class extends VNodeQuery {
  get nodeType() {
    return VNode.DOCUMENT_FRAGMENT_NODE;
  }
  get nodeName() {
    return "#document-fragment";
  }
  render(h2 = htmlVDOM) {
    return this._childNodes.map((c) => c.render(h2) || []).join("");
  }
  get innerHTML() {
    return this._childNodes.map((c) => c.render(html)).join("");
  }
  createElement(name, attrs = {}) {
    return new VElement(name, attrs);
  }
  createDocumentFragment() {
    return new VDocumentFragment();
  }
  createTextNode(text) {
    return new VTextNode(text);
  }
};
var VDocument = class extends VDocumentFragment {
  get nodeType() {
    return VNode.DOCUMENT_NODE;
  }
  get nodeName() {
    return "#document";
  }
  get documentElement() {
    return this.firstChild;
  }
  render(h2 = htmlVDOM) {
    let content = super.render(h2);
    if (this.docType) {
      content = this.docType.render() + content;
    }
    return content;
  }
};
var VHTMLDocument = class extends VDocument {
  constructor(empty = false) {
    super();
    this.docType = new VDocType();
    if (!empty) {
      let html2 = new VElement("html");
      let body = new VElement("body");
      let head = new VElement("head");
      let title = new VElement("title");
      html2.appendChild(head);
      head.appendChild(title);
      html2.appendChild(body);
      this.appendChild(html2);
    }
  }
  get body() {
    let body = this.querySelector("body");
    if (!body) {
      let html2 = this.querySelector("html");
      if (!html2) {
        html2 = new VElement("html");
        this.appendChild(html2);
      }
      body = new VElement("body");
      html2.appendChild(html2);
    }
    return body;
  }
  get title() {
    var _a;
    return ((_a = this.querySelector("title")) == null ? void 0 : _a.textContent) || "";
  }
  set title(title) {
    const titleElement = this.querySelector("title");
    if (titleElement)
      titleElement.textContent = title;
  }
  get head() {
    let head = this.querySelector("head");
    if (!head) {
      let html2 = this.querySelector("html");
      if (!html2) {
        html2 = new VElement("html");
        this.appendChild(html2);
      }
      head = new VElement("head");
      html2.insertBefore(html2);
    }
    return head;
  }
};
function createDocument() {
  return new VDocument();
}
function createHTMLDocument() {
  return new VHTMLDocument();
}
var document = createDocument();
var h = hFactory({ document });

// src/utils.ts
function removeBodyContainer(body) {
  let ehead = body.querySelector("head");
  let ebody = body.querySelector("body");
  if (ebody || ehead) {
    let body2 = new VDocumentFragment();
    ehead && body2.appendChild(ehead.childNodes);
    ebody && body2.appendChild(ebody.children);
    return body2;
  }
  return body;
}

// src/htmlparser.ts
var attrRe = /([^=\s]+)(\s*=\s*(("([^"]*)")|('([^']*)')|[^>\s]+))?/gm;
var endTagRe = /^<\/([^>\s]+)[^>]*>/m;
var startTagRe = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*(("[^"]*")|('[^']*')|[^>\s]+))?)*)\s*\/?\s*>/m;
var selfCloseTagRe = /\s*\/\s*>\s*$/m;
var HtmlParser = class {
  constructor(options) {
    this.attrRe = attrRe;
    this.endTagRe = endTagRe;
    this.startTagRe = startTagRe;
    this.defaults = { ignoreWhitespaceText: false };
    options = options || {};
    if (options.scanner) {
      this.scanner = options.scanner;
      options.scanner = null;
    }
    this.options = Object.assign({}, this.defaults, options);
  }
  parse(html2) {
    let treatAsChars = false;
    let index, match, characters;
    while (html2.length) {
      if (html2.substring(0, 4) === "<!--") {
        index = html2.indexOf("-->");
        if (index !== -1) {
          this.scanner.comment(html2.substring(4, index));
          html2 = html2.substring(index + 3);
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      } else if (html2.substring(0, 2) === "</") {
        match = this.endTagRe.exec(html2);
        if (match) {
          html2 = RegExp.rightContext;
          treatAsChars = false;
          this.parseEndTag(RegExp.lastMatch, match[1]);
        } else {
          treatAsChars = true;
        }
      } else if (html2.charAt(0) === "<") {
        match = this.startTagRe.exec(html2);
        if (match) {
          html2 = RegExp.rightContext;
          treatAsChars = false;
          this.parseStartTag(RegExp.lastMatch, match[1], match);
        } else {
          treatAsChars = true;
        }
      }
      if (treatAsChars) {
        index = html2.indexOf("<");
        if (index === 0) {
          index = html2.substring(1).indexOf("<");
        }
        if (index === -1) {
          characters = html2;
          html2 = "";
        } else {
          characters = html2.substring(0, index);
          html2 = html2.substring(index);
        }
        if (!this.options.ignoreWhitespaceText || !/^\s*$/.test(characters)) {
          this.scanner.characters(characters);
        }
      }
      treatAsChars = true;
      match = null;
    }
  }
  parseStartTag(input, tagName, match) {
    const isSelfColse = selfCloseTagRe.test(input);
    let attrInput = match[2];
    if (isSelfColse) {
      attrInput = attrInput.replace(/\s*\/\s*$/, "");
    }
    const attrs = this.parseAttributes(tagName, attrInput);
    this.scanner.startElement(tagName, attrs, isSelfColse, match[0]);
  }
  parseEndTag(input, tagName) {
    this.scanner.endElement(tagName);
  }
  parseAttributes(tagName, input) {
    const attrs = {};
    input.replace(this.attrRe, (attr, name, c2, value, c4, valueInQuote, c6, valueInSingleQuote) => {
      attrs[name] = valueInSingleQuote ?? valueInQuote ?? value ?? true;
    });
    return attrs;
  }
};

// src/vdomparser.ts
function vdom(obj = null) {
  if (obj instanceof VNode) {
    return obj;
  }
  if (obj instanceof Buffer) {
    obj = obj.toString("utf-8");
  }
  if (typeof obj === "string") {
    return parseHTML(obj);
  }
  return new VDocumentFragment();
}
function parseHTML(html2) {
  if (typeof html2 !== "string") {
    console.error("parseHTML requires string, found", html2);
    throw new Error("parseHTML requires string");
  }
  let frag = html2.indexOf("<!") === 0 ? new VHTMLDocument(true) : new VDocumentFragment();
  let stack = [frag];
  let parser = new HtmlParser({
    scanner: {
      startElement(tagName, attrs, isSelfClosing) {
        const lowerTagName = tagName.toLowerCase();
        if (lowerTagName === "!doctype") {
          frag.docType = new VDocType();
          return;
        }
        for (let name in attrs) {
          if (attrs.hasOwnProperty(name)) {
            let value = attrs[name];
            if (typeof value === "string") {
              attrs[name] = unescapeHTML(value);
            }
          }
        }
        let parentNode = stack[stack.length - 1];
        if (parentNode) {
          const element = document.createElement(tagName, attrs);
          parentNode.appendChild(element);
          if (!(SELF_CLOSING_TAGS.includes(tagName.toLowerCase()) || isSelfClosing)) {
            stack.push(element);
          }
        }
      },
      endElement(tagName) {
        stack.pop();
      },
      characters(text) {
        var _a;
        text = unescapeHTML(text);
        let parentNode = stack[stack.length - 1];
        if (((_a = parentNode == null ? void 0 : parentNode.lastChild) == null ? void 0 : _a.nodeType) === VNode.TEXT_NODE) {
          parentNode.lastChild._text += text;
        } else {
          if (parentNode) {
            parentNode.appendChild(new VTextNode(text));
          }
        }
      },
      comment(text) {
      }
    }
  });
  parser.parse(html2);
  return frag;
}
VElement.prototype.setInnerHTML = function(html2) {
  let frag = parseHTML(html2);
  this._childNodes = frag._childNodes;
  this._fixChildNodesParent();
};

// src/tidy.ts
var SELECTOR_BLOCK_ELEMENTS = "meta,link,script,p,h1,h2,h3,h4,h5,h6,blockquote,div,ul,ol,li,article,section,footer,head,body,title,nav,section,article,hr,form";
var TAGS_KEEP_CONTENT = ["PRE", "CODE", "SCRIPT", "STYLE", "TT"];
function level(element) {
  let indent = "";
  while (element.parentNode) {
    indent += "  ";
    element = element.parentNode;
  }
  return indent.substr(2);
}
function tidyDOM(document2) {
  document2.handle(SELECTOR_BLOCK_ELEMENTS, (e) => {
    var _a, _b, _c, _d, _e, _f;
    let ee = e;
    while (ee) {
      if (TAGS_KEEP_CONTENT.includes(ee.tagName))
        return;
      ee = ee.parentNode;
    }
    let prev = e.previousSibling;
    if (!prev || prev.nodeType !== VNode.TEXT_NODE || !((_a = prev.nodeValue) == null ? void 0 : _a.endsWith("\n"))) {
      (_b = e.parentNode) == null ? void 0 : _b.insertBefore(new VTextNode("\n"), e);
    }
    (_c = e.parentNode) == null ? void 0 : _c.insertBefore(new VTextNode(level(e)), e);
    let next = e.nextSibling;
    if (!next || next.nodeType !== VNode.TEXT_NODE || !((_d = next.nodeValue) == null ? void 0 : _d.startsWith("\n"))) {
      if (next) {
        (_e = e.parentNode) == null ? void 0 : _e.insertBefore(new VTextNode("\n"), next);
      } else {
        (_f = e.parentNode) == null ? void 0 : _f.appendChild(new VTextNode("\n"));
      }
    }
    if (e.childNodes.length) {
      let first = e.firstChild;
      if (first.nodeType === VNode.TEXT_NODE) {
        e.insertBefore(new VTextNode("\n" + level(e) + "  "));
      }
      e.appendChild(new VTextNode("\n" + level(e)));
    }
  });
}

// src/xml.ts
function xml(itag, iattrs, ...ichildren) {
  let { tag, attrs, children } = hArgumentParser(itag, iattrs, ichildren);
  return markup(true, tag, attrs, children);
}
xml.firstLine = '<?xml version="1.0" encoding="utf-8"?>';
xml.xml = true;
export {
  CDATA,
  VDocType,
  VDocument,
  VDocumentFragment,
  VElement,
  VHTMLDocument,
  VNode,
  VNodeQuery,
  VTextNode,
  createDocument,
  createHTMLDocument,
  document,
  escapeHTML,
  h,
  hArgumentParser,
  hFactory,
  html,
  parseHTML,
  removeBodyContainer,
  tidyDOM,
  unescapeHTML,
  vdom,
  xml
};
/*! https://mths.be/he v1.2.0 by @mathias | MIT license */
//# sourceMappingURL=index.js.map