/**
 * @author      Jakub Kocvara <jakubkocvara @ gmail.com>
 * @since       2014-04-01
 */

RubiksCube.prototype.phases = ['crossMoves', 'f2lMoves', 'ollMoves', 'pllMoves'];

RubiksCube.prototype.whiteEdges = [2, 5, 8, 11];

RubiksCube.prototype.upperLayerParts = [6, 9, 0, 0, 2, 3, 4, 6];

RubiksCube.prototype.sideNumbers = [2, 0, 5, 3];

RubiksCube.prototype.f2lEdges = [1, 4, 7, 10];

RubiksCube.prototype.topLayerEdges = [0, 3, 6, 9];

RubiksCube.prototype.topLayerCorners = [0, 2, 4, 6];

RubiksCube.prototype.bottomLayerCorners = [1, 3, 5, 7];

RubiksCube.prototype.FACE_TO_COLOR = ['green', 'yellow', 'red', 'blue', 'white', 'orange'];

RubiksCube.prototype.col = {
    green: 0,
    orange: 1,
    blue: 2,
    red: 3
}

RubiksCube.prototype.LETTER_TO_TURN_MAP = {
    R: {
        axis: 0,
        layer: 4,
        anglecoef: 1
    },
    L: {
        axis: 0,
        layer: 1,
        anglecoef: -1
    },
    F: {
        axis: 2,
        layer: 4,
        anglecoef: 1
    },
    B: {
        axis: 2,
        layer: 1,
        anglecoef: -1
    },
    U: {
        axis: 1,
        layer: 4,
        anglecoef: 1
    },
    D: {
        axis: 1,
        layer: 1,
        anglecoef: -1
    },
    M: {
        axis: 0,
        layer: 2,
        anglecoef: -1
    },
    E: {
        axis: 1,
        layer: 2,
        anglecoef: -1
    },
    S: {
        axis: 2,
        layer: 2,
        anglecoef: 1
    },
    r: {
        axis: 0,
        layer: 6,
        anglecoef: 1
    },
    l: {
        axis: 0,
        layer: 3,
        anglecoef: -1
    },
    f: {
        axis: 2,
        layer: 6,
        anglecoef: 1
    },
    b: {
        axis: 2,
        layer: 3,
        anglecoef: -1
    },
    u: {
        axis: 1,
        layer: 6,
        anglecoef: 1
    },
    d: {
        axis: 1,
        layer: 3,
        anglecoef: -1
    },
    x: {
        axis: 0,
        layer: 7,
        anglecoef: 1
    },
    y: {
        axis: 1,
        layer: 7,
        anglecoef: 1
    },
    z: {
        axis: 2,
        layer: 7,
        anglecoef: 1
    }
}

RubiksCube.prototype.sideIndexes = {
    red: 0,
    green: 1,
    orange: 2,
    blue: 3
}

RubiksCube.prototype.f2lGroups = {
    red: {
        corner: 1,
        edge: 1
    },
    green: {
        corner: 3,
        edge: 4
    },
    orange: {
        corner: 5,
        edge: 7
    },
    blue: {
        corner: 7,
        edge: 10
    }
}

RubiksCube.prototype.F2L_ALGORITHMS = {
    1: "U (R U' R')",
    2: "F R' F' R",
    3: "F' U' F",
    4: "(R U R')",
    5: "(U' R U R') U2 (R U' R')",
    6: "U' (r U' R' U) (R U r')",
    7: "U' (R U2' R') U2 (R U' R')",
    8: "d (R' U2 R) U2' (R' U R)",
    9: "U' R U' R' d R' U' R",
    10: "U' (R U R' U)(R U R')",
    11: "U' (R U2' R') d (R' U' R)",
    12: "R U' R' U R U' R' U2 R U' R'",
    13: "d (R' U R U')(R' U' R)",
    14: "U' (R U' R' U)(R U R')",
    15: "U (R' F R F') U (R U R')",
    16: "(R U' R' U) d (R' U' R)",
    17: "(R U2 R') U' (R U R')",
    18: "y' (R' U2 R) U (R' U' R)",
    19: "U R U2 R2 (F R F')",
    20: "U' F' U2 F2 (R' F' R)",
    21: "(R U' R') U2 (R U R')",
    22: "y' (R' U R) U2 (R' U' R)",
    23: "U2 R2 U2 (R' U' R U') R2",
    24: "U F' L' U L F R U R'",
    25: "d' (L' U L) d (R U' R')",
    26: "U (R U' R') d' (L' U L)",
    27: "(R U' R' U)(R U' R')",
    28: "(R U R' U') F R' F' R",
    29: "y' (R' U' R U)(R' U' R)",
    30: "(R U R' U')(R U R')",
    31: "(R U' R') d (R' U R)",
    32: "(R U R' U')(R U R' U')(R U R')",
    33: "y U' L' U' R' U L U' R",
    34: "U' (R U2' R') U (R U R')",
    35: "(U' R U R') d (R' U' R)",
    36: "d (R' U' R) d' (R U R')",
    37: "",
    38: "(R U R') U2 (R U2 R') d (R' U' R)",
    39: "(R U' R') U' (R U R') U2 (R U' R')",
    40: "(R U' R' U)(R U2' R') U (R U' R')",
    41: "(R U' R') d (R' U' R U')(R' U' R)",
    42: "(R U' R' U) d (R' U' R U') (R' U R)"
}

RubiksCube.prototype.OLL_CASES = {
    1: [0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    2: [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
    3: [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1],
    4: [1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
    5: [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1],
    6: [0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
    7: [0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    8: [1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
    9: [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0],
    10: [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
    11: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
    12: [1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
    13: [0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0],
    14: [1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0],
    15: [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    16: [0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
    17: [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1],
    18: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
    19: [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1],
    20: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    21: [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    22: [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    23: [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    24: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    25: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    26: [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    27: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    28: [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    29: [0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    30: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
    31: [0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
    32: [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0],
    33: [1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    34: [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
    35: [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    36: [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0],
    37: [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    38: [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0],
    39: [0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
    40: [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    41: [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    42: [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    43: [0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    44: [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    45: [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    46: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
    47: [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    48: [0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    49: [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0],
    50: [0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
    51: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0],
    52: [1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0],
    53: [0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    54: [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    55: [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    56: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    57: [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    58: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

RubiksCube.prototype.OLL_ALGORITHMS = {
    "1": "(R U2) (R2' F R F' U2') (R' F R F')",
    "2": "F (R U R' U') F' f (R U R' U') f'",
    "3": "(y) f (R U R' U') f' U' F (R U R' U') F'",
    "4": "f (R U R' U') f' U F (R U R' U') F'",
    "5": "(r' U2) (R U R' U r)",
    "6": "(y2) r U2 R' U' R U' r'",
    "7": "r U R' U R U2 r'",
    "8": "l' U' L U' L' U2 l",
    "9": "(y') R U R' U' R' F R2 U R' U' F'",
    "10": "(y') R U R' y R' F R U' R' F' R",
    "11": "r' R2 U R' U R U2 R' U M'",
    "12": "F R U R' U' F' U F R U R' U' F'",
    "13": "F U R U' R2 F' R U R U' R'",
    "14": "R' F R U R' F' R y' R U' R'",
    "15": "(y2) l' U' l L' U' L U l' U l",
    "16": "(y2) r U r' R U R' U' r U' r'",
    "17": "R U R' U (R' F R F') U2 (R' F R F')",
    "18": "(y') r U R' U R U2 r2' U' R U' R' U2 r",
    "19": "r' R U R U R' U' r R2' F R F'",
    "20": "r' R U R U R' U' r2 R2' U R U' r'",
    "21": "R U R' U R U' R' U R U2 R'",
    "22": "R U2 R2' U' R2 U' R2' U2 R",
    "23": "R2' D' R U2 R' D R U2 R",
    "24": "r U R' U' L' U R U' x'",
    "25": "R U2 R' U' (R U R' U') (R U R' U') R U' R'",
    "26": "y2 R' U' R U' R' U2 R",
    "27": "R U R' U R U2 R'",
    "28": "r U R' U' r' R U R U' R'",
    "29": "M U (R U R' U') (R' F R F') M'",
    "30": "r' U2 R U R' U r R U2 R' U' R U' R'",
    "31": "(y2) R' U' F U R U' R' F' R",
    "32": "R U B' U' R' U R B R'",
    "33": "(R U R' U') (R' F R F')",
    "34": "R U R' U' x D' R' U R E' z'",
    "35": "R U2 R2' F R F' R U2 R'",
    "36": "R' U' R U' R' U R U R y R' F' R",
    "37": "(y) F R U' R' U' R U R' F'",
    "38": "L U L' U L U' L' U' L' B L B'",
    "39": "L F' L' U' L U F U' L'",
    "40": "R' F R U R' U' F' U R",
    "41": "R U' R' U2 R U y R U' R' y' U' R'",
    "42": "r' R2 y R U R' U' y' R' U M'",
    "43": "(y) R' U' F' U F R",
    "44": "f R U R' U' f'",
    "45": "F (R U R' U') F'",
    "46": "R' U' R' F R F' U R",
    "47": "F' L' U' L U L' U' L U F",
    "48": "F R U R' U' R U R' U' F'",
    "49": "R B' R2 F R2 B R2 F' R",
    "50": "(y2) R' F R2 B' R2 F' R2 B R'",
    "51": "F U R U' R' U R U' R' F'",
    "52": "R' U' R U' R' d R' U R B",
    "53": "l' U' L U' L' U L U' L' U2 l",
    "54": "r U R' U R U' R' U R U2 r'",
    "55": "(y) R' F R U R U' R2 F' R2 U' R' U R U R'",
    "56": "r U r' U R U' R' U R U' R' r U' r'",
    "57": "M' U' M' U' M' d2 M' U' M' U' M'",
    "58": ""
}

RubiksCube.prototype.PLL_PATTERNS = {
    "H": [1, 0, 1, 0, 1, 0, 1, 0],
    "U": [1, 1, 1, 0, 1, 0, 1, 0],
    "A": [1, 1, 0, 1, 0, 1, 0, 1],
    "E": [0, 1, 0, 1, 0, 1, 0, 1],
    "F": [1, 1, 1, 0, 0, 1, 0, 0],
    "Gab": [0, 0, 0, 1, 1, 0, 0, 0],
    "Gcd": [0, 0, 0, 0, 0, 0, 1, 1],
    "Ja": [0, 0, 1, 1, 1, 1, 0, 0],
    "Jb": [1, 0, 0, 0, 0, 1, 1, 1],
    "Na": [0, 1, 1, 0, 0, 1, 1, 0],
    "Nb": [1, 1, 0, 0, 1, 1, 0, 0],
    "Ra": [0, 1, 0, 0, 1, 0, 1, 1],
    "Rb": [1, 0, 1, 0, 0, 1, 0, 1],
    "T": [1, 1, 0, 0, 0, 1, 1, 0],
    "V": [1, 1, 0, 0, 1, 0, 0, 1],
    "Y": [1, 1, 0, 1, 1, 0, 0, 0],
    "solved": [1, 1, 1, 1, 1, 1, 1, 1]
}

RubiksCube.prototype.PLL_ALGORITHMS = {
    "H": "M2' U M2' U2 M2' U M2'",
    "Ua": "R2 U' R' U' R U R U R U' R",
    "Ub": "R' U R' U' R' U' R' U R U R2",
    "Z": "M2' U M2' U M' U2 M2' U2 M' U2",
    "Aa": "R' F R' B2 R F' R' B2 R2",
    "Ab": "y R B' R F2 R' B R F2 R2",
    "E": "(y x') R U' R' D R U R' D' R U R' D R U' R' D' (x)",
    "F": "R' U R U' R2 F' U' F U R F R' F' R2 U'",
    "Ga": "(y) R2' u R' U R' U' R u' R2 (y') R' U R",
    "Gb": "R' U' R (y) R2 u R' U R U' R u' R2",
    "Gc": "(y) R2' u' R U' R U R' u R2 (y) R U' R'",
    "Gd": "(y2) R U R' (y') R2 u' R U' R' U R' u R2",
    "Ja": "B' U F' U2 B U' B' U2 F B U'",
    "Jb": "B U' F U2 B' U B U2 F' B' U",
    "Na": "(L U' R U2 L' U R') (L U' R U2 L' U R') U'",
    "Nb": "(R' U L' U2 R U' L) (R' U L' U2 R U' L) U",
    "Ra": "R U2 R' U2 R B' R' U' R U R B R2 U",
    "Rb": "R' U2 R U2 R' F R U R' U' R' F' R2' U'",
    "T": "R U R' U' R' F R2 U' R' U' R U R' F'",
    "V": "R' U R' U' B' R' B2 U' B' U B' R B R",
    "Y": "F R U' R' U' R U R' F' R U R' U' R' F R F'"
}