/**
 * @author      Jakub Kocvara <jakubkocvara@gmail.com>
 * @since       2014-04-01
 */

RubiksCube.prototype.moves = [];

RubiksCube.prototype.crossMoves = [];

RubiksCube.prototype.f2lMoves = [];

RubiksCube.prototype.ollMoves = [];

RubiksCube.prototype.pllMoves = [];

RubiksCube.prototype.phase = 0;

RubiksCube.prototype.crossLogging = false;

RubiksCube.prototype.f2lLogging = false;

RubiksCube.prototype.animate = true;

var histogram = {};

var moveIndex = 0;

time = 200;

var playback;


RubiksCube.prototype.solveExec = function () {
    this.before = this.clone();
    var cl = this.clone();
    this.crossMoves = cl.solveCross();
    this.f2lMoves = cl.solveF2L();
    this.ollMoves = cl.solveOLL();
    this.pllMoves = cl.solvePLL();
    //this.animate = false;
    moveIndex = 0;
    this.moves = [].concat(this.crossMoves, this.f2lMoves, this.ollMoves, this.pllMoves);
    showMoves(this.convertToNotation(this.crossMoves), this.convertToNotation(this.f2lMoves), this.convertToNotation(this.ollMoves), this.convertToNotation(this.pllMoves));
    this.executeMoves(this.moves);
    //this.animate = true;
}

RubiksCube.prototype.solveCross = function () {
    this.phase = 0;
    this.crossMoves = [];

    var cl = null;
    var orders = permute(Object.keys(this.col));
    for (var i = 0; i < orders.length; i++) {
        cl = this.clone();
        cl.crossMoves = [];

        cl.turnSide('red');

        for (var key in orders[i]) {
            cl.solveEdge(orders[i][key]);
        }
        cl.adjustCross();
        cl.crossMoves = beautifyMoves(cl.crossMoves);
        //console.log(cl.moves.length);
        if (i === 0 || cl.crossMoves.length < this.crossMoves.length) {
            if (cl.isCrossSolved()) {
                this.crossMoves = cl.crossMoves;
            }
        }
    }

    this.animate = false;
    this.executeMoves(this.crossMoves);
    this.animate = true;

    if (this.crossLogging) {
        var count = countRealMoves(this.crossMoves);
        if (typeof histogram[count] == 'undefined') {
            histogram[count] = 1;
        } else {
            histogram[count]++;
        }
    }

    //this.moves = this.crossMoves;
    return this.crossMoves;
}

RubiksCube.prototype.solveF2L = function () {
    this.phase = 1;
    this.f2lMoves = [];
    var sides = Object.keys(this.f2lGroups);
    var best = 0, current = 0;
    var bestSide = 0;

    while (sides.length) {
        best = 0;
        bestSide = 0;
        for (var i = 0; i < sides.length; i++) {
            current = this.evaluateGoodness(sides[i]);
            if (best < current) {
                best = current;
                bestSide = i;
            }
        }
        this.solveF2LGroup(sides[bestSide]);
        sides.splice(bestSide, 1);
    }

    this.f2lMoves = beautifyMoves(this.f2lMoves);

    if (this.f2lLogging) {
        var count = countRealMoves(this.f2lMoves);
        if (typeof histogram[count] == 'undefined') {
            histogram[count] = 1;
        } else {
            histogram[count]++;
        }
    }

    return this.f2lMoves;
}

RubiksCube.prototype.solveOLL = function () {
    this.phase = 2;
    this.ollMoves = [];

    var ollsit = this.getOLLSituation();

    this.addAlgorithm(this.OLL_ALGORITHMS[ollsit]);

    this.ollMoves = beautifyMoves(this.ollMoves);
    //this.moves = this.moves.concat(this.ollMoves);
    return this.ollMoves;
}

RubiksCube.prototype.solvePLL = function () {
    this.phase = 3;
    this.pllMoves = [];

    var res = this.getPLLPattern();

    var maxIndex = res.maxIndex;
    var bestPattern = res.bestPattern;

    maxIndex = maxIndex === 3 ? -1 : maxIndex;
    if (maxIndex) {
        this.addMove(1, 4, maxIndex);
    }

    var pllsit = this.getPLLSituation(bestPattern);

    if (pllsit != "solved") {
        this.addAlgorithm(this.PLL_ALGORITHMS[pllsit]);
    }

    this.pllMoves = beautifyMoves(this.pllMoves);
    //this.moves = this.moves.concat(this.pllMoves);
    return this.pllMoves;
}


RubiksCube.prototype.addMove = function (axis, layer, angle) {
    this[this.phases[this.phase]].push({ axis: axis, layer: layer, angle: angle });
    this.transform(axis, layer, angle);
}

RubiksCube.prototype.executeMoves = function (moves) {
    //console.log(this.moves.length);
    var that = this;

    //this.animate = false;
    if (this.animate) {
        playback = setVariableInterval(function () {
            if (moveIndex === that.moves.length) {
                this.stop();
                return;
            }
            if (time !== this.interval) {
                this.interval = time;
            }
            highlightMove(moveIndex);
            that.transform(moves[moveIndex].axis, moves[moveIndex].layer, moves[moveIndex].angle);
            moveIndex++;
        }, time);
    }
    else {
        this.setQuiet(true);
        for (var i = 0; i < moves.length; i++) {
            this.transform(moves[i].axis, moves[i].layer, moves[i].angle);
        }
        this.setQuiet(false);
    }
}

RubiksCube.prototype.convertToNotation = function (moves) {
    var notation = [];
    for (var i = 0; i < moves.length; i++) {
        for (var key in this.LETTER_TO_TURN_MAP) {
            if (moves[i].axis === this.LETTER_TO_TURN_MAP[key].axis && moves[i].layer === this.LETTER_TO_TURN_MAP[key].layer) {
                if (moves[i].angle === this.LETTER_TO_TURN_MAP[key].anglecoef) {
                    notation.push(key);
                    break;
                }
                else if (moves[i].angle === 2) {
                    notation.push(key + "2");
                    break;
                }
                else {
                    notation.push(key + "'");
                    break;
                }
            }
        }
    }
    return notation;
}

RubiksCube.prototype.scramble2 = function () {
    var scrambleMoves = [];
    var axis, layer, angle;
    var prevAxis = -1;
    this.setQuiet(true);
    for (var i = 0; i < 20; i++) {
        while ((axis = Math.floor(Math.random() * 3)) == prevAxis) { }
        prevAxis = axis;
        layer = (Math.random() * 2 < 1 ? 1 : 4);
        angle = Math.round(Math.random() * 3) - 1;
        if (angle != 0) {
            this.transform(axis, layer, angle);
        }
        else {
            i--;
        }
    }
    this.setQuiet(false);
}

RubiksCube.prototype.isCrossSolved = function () {
    var a = this.getUnsolvedParts();
    var b = [10, 13, 16, 19];
    return intersection(a, b).length ? false : true;
}

RubiksCube.prototype.testCross = function () {
    histogram = {};
    var cube = this.clone();
    cube.crossLogging = true;
    for (var i = 0; i < 10000; i++) {
        permArr = [];
        usedChars = [];
        cube.scramble2();
        cube.solveCross();
    }
    cube.crossLogging = false;
}

RubiksCube.prototype.testF2L = function () {
    histogram = {};
    var cube = this.clone();
    cube.f2lLogging = true;
    cube.animate = false;
    for (var i = 0; i < 10000; i++) {
        permArr = [];
        usedChars = [];
        cube.scramble2();
        cube.solveCross();
        cube.solveF2L();
    }
    cube.f2lLogging = false;
    cube.animate = true;
}

RubiksCube.prototype.turn = function (move) {
    var angle = 1;
    if (move.length > 1) {
        if (move[1] === '\'') {
            angle = -1;
        }
        else if (move[1] === '2') {
            angle = 2;
        }
    }
    return {
        axis: this.LETTER_TO_TURN_MAP[move[0]].axis,
        layer: this.LETTER_TO_TURN_MAP[move[0]].layer,
        angle: angle * this.LETTER_TO_TURN_MAP[move[0]].anglecoef
    }
}

RubiksCube.prototype.addAlgorithm = function (alg) {
    if (alg.length === 0) return;
    var moves = parseNotation(alg);
    for (var i = 0; i < moves.length; i++) {
        this.addMove(this.turn(moves[i]).axis, this.turn(moves[i]).layer, this.turn(moves[i]).angle);
    }
}

RubiksCube.prototype.evaluateGoodness = function (side) {
    var edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    var cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
    var goodness = 0;

    if (this.topLayerCorners.indexOf(cornerLoc) !== -1) {
        goodness++;
    }

    if (this.topLayerEdges.indexOf(edgeLoc) !== -1) {
        goodness++;
    }
    return goodness;
}


RubiksCube.prototype.solveEdge = function (edge) {
    var eindex = this.col[edge];
    var loc = this.getEdgeLocation(this.whiteEdges[eindex]);
    var ori = this.getPartOrientation(8 + this.whiteEdges[eindex]);
    var edgeOri = (edge == 'red' || edge == 'orange') ? 1 : 0;
    var face = this.getPartFace(8 + this.whiteEdges[eindex], edgeOri);
    var face2 = this.getPartFace(8 + this.whiteEdges[eindex], !edgeOri);
    var layer = face2 < 3 ? 4 : 1;
    var layer2 = face < 3 ? 4 : 1;
    var axis = this.getPartAxis(8 + this.whiteEdges[eindex], edgeOri);
    var edgePositions;


    if (face == 1) {
        var ax = (axis == 0) ? 2 : 0;
        edgePositions = this.getFirstLayerEdgePositions();
        if (edgePositions) {
            var offFirst = edgePositions.offset;
            var offLast = this.whiteEdges.indexOf(loc + 2) - eindex;
            offFirst = Math.abs(offFirst) == 3 ? (offFirst < 0 ? 1 : -1) : offFirst;
            offFirst = offFirst == -2 ? 2 : offFirst;
            offLast = Math.abs(offLast) == 3 ? (offLast < 0 ? 1 : -1) : offLast;
            offLast = offLast == -2 ? 2 : offLast;
            var off = offFirst - offLast;
            off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;
            if (off != 0) {
                this.addMove(1, 1, off);
            }
        }
        this.addMove(ax, layer, 2);
    }
    else if (face == 4) {
        var ax = (axis == 0) ? 2 : 0;
        edgePositions = this.getFirstLayerEdgePositions();
        if (loc != edgePositions[edge]) {
            this.addMove(ax, layer, 2);
            this.solveEdge(edge);
        }
    }
    else if (face2 == 4) {
        var ax = (axis == 0) ? 2 : 0;
        var angle = 1;
        var correct = false;
        edgePositions = this.getFirstLayerEdgePositions();
        if (edgePositions) {
            var offFirst = edgePositions.offset;
            var offLast = this.whiteEdges.indexOf(loc + 2) - eindex;
            offFirst = Math.abs(offFirst) == 3 ? (offFirst < 0 ? 1 : -1) : offFirst;
            offFirst = offFirst == -2 ? 2 : offFirst;
            offLast = Math.abs(offLast) == 3 ? (offLast < 0 ? 1 : -1) : offLast;
            offLast = offLast == -2 ? 2 : offLast;
            //console.log("offFirst " + offFirst + " offLast " + offLast);
            var off = offFirst - offLast;
            off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;
            var a = this.whiteEdges.indexOf(loc + 2);
            var b = this.whiteEdges.indexOf(edgePositions[edge]);
            //console.log('a: ' + a + ' b: ' + b);
            var angle = a < b ? 1 : -1;
            angle = layer2 == 1 ? -angle : angle;
            angle = Math.abs(a - b) >= 2 ? -angle : angle;
            this.addMove(ax, layer2, angle);
            off = Math.abs(off) == 1 ? 0 : 1;
            if (off != 0) {
                this.addMove(1, 1, off);
            }
        }
        else {
            this.addMove(ax, layer2, angle);
        }
        this.solveEdge(edge);
    }
    else if (face2 == 1) {
        var ax = (axis == 0) ? 2 : 0;
        var angle = 1;
        var correct = false;
        edgePositions = this.getFirstLayerEdgePositions();
        if (edgePositions) {
            var offFirst = edgePositions.offset;
            var offLast = this.whiteEdges.indexOf(loc + 2) - eindex;
            offFirst = Math.abs(offFirst) == 3 ? (offFirst < 0 ? 1 : -1) : offFirst;
            offFirst = offFirst == -2 ? 2 : offFirst;
            offLast = Math.abs(offLast) == 3 ? (offLast < 0 ? 1 : -1) : offLast;
            offLast = offLast == -2 ? 2 : offLast;
            //console.log("offFirst " + offFirst + " offLast " + offLast);
            var off = offFirst - offLast;
            off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;
            off = Math.abs(off) == 1 ? 0 : 1;
            if (off != 0) {
                this.addMove(1, 1, off);
            }
            edgePositions = this.getFirstLayerEdgePositions();
            var a = this.whiteEdges.indexOf(loc + 2);
            var b = this.whiteEdges.indexOf(edgePositions[edge]);
            //console.log('a: ' + a + ' b: ' + b);
            var angle = a < b ? 1 : -1;
            angle = layer2 == 1 ? -angle : angle;
            angle = Math.abs(a - b) >= 2 ? -angle : angle;
            var disruptedEdgeColor = getKey(edgePositions, loc + 2);
            var disruptedEdgeNumber = this.whiteEdges[this.col[disruptedEdgeColor]];

            if (this.getEdgeLocation(disruptedEdgeNumber) == edgePositions[disruptedEdgeColor]) {
                correct = true;
            }
        }
        this.addMove(ax, layer2, angle);
        this.solveEdge(edge);
        if (correct) {
            this.addMove(ax, layer2, -angle);
        }

    }
    else if (face != 4) {
        ori = edgeOri ? !ori : ori;
        var ax = ori ? 0 : 2;
        var angle = (face == 3 || face == 5) ? -1 : 1;
        angle = ori ? -angle : angle;
        edgePositions = this.getFirstLayerEdgePositions();
        if (edgePositions) {
            var offFirst = edgePositions.offset;
            var offLast = getWhiteEdgeIndex(ax, layer) - eindex;
            offFirst = Math.abs(offFirst) == 3 ? (offFirst < 0 ? 1 : -1) : offFirst;
            offFirst = offFirst == -2 ? 2 : offFirst;
            offLast = Math.abs(offLast) == 3 ? (offLast < 0 ? 1 : -1) : offLast;
            offLast = offLast == -2 ? 2 : offLast;
            var off = offFirst - offLast;
            off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;
            if (off != 0) {
                this.addMove(1, 1, off);
            }
        }
        this.addMove(ax, layer, angle);
    }
}

RubiksCube.prototype.getFirstLayerEdgePositions = function () {
    var edgeObj = {};
    for (var i in this.whiteEdges) {
        var loc = this.getEdgeLocation(this.whiteEdges[i]);
        //console.log(this.whiteEdges.indexOf(loc));
        var ori = (i % 2) ? 1 : 0;
        if (this.getPartFace(8 + this.whiteEdges[i], ori) == 4) {
            var offset = this.whiteEdges.indexOf(loc) - i;
            //console.log('offset: ' + offset);
            edgeObj.offset = offset;
            //console.log(this.getKey(this.col,i) + ' je prvni spravne');	
            //console.log('pozice: ');
            for (var j in this.col) {
                var index = mod(4, parseInt(this.col[j]) + parseInt(offset));
                edgeObj[j] = this.whiteEdges[index];
                //console.log(j + ': ' + this.whiteEdges[index]);
            }
            return edgeObj;
        }
    }
}

RubiksCube.prototype.adjustCross = function () {
    edgePositions = this.getFirstLayerEdgePositions();
    if (edgePositions) {
        var angle = edgePositions.offset == 3 ? -1 : edgePositions.offset;
        if (angle !== 0) {
            this.addMove(1, 1, angle);
        }
    }
}

RubiksCube.prototype.solveF2LGroup = function (side) {
    var edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    var cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);

    var cl = this.clone();
    var clf2lsit = this.getF2LSituation(side);

    if (clf2lsit === 37) return;

    if (clf2lsit === -1) {
        //console.log('neco chystam');
        if (this.topLayerCorners.indexOf(cornerLoc) === -1 && this.topLayerEdges.indexOf(edgeLoc) === -1) {
            //console.log('vytahuju oba - ' + side);
            this.bringUpEdge(side);
            cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
            if (this.topLayerCorners.indexOf(cornerLoc) === -1) {
                this.positionEdge(side);
                this.bringUpCorner(side);
            }
        }
        else if (this.topLayerCorners.indexOf(cornerLoc) !== -1 && this.topLayerEdges.indexOf(edgeLoc) === -1) {// && edgeLoc !== this.f2lGroups[side].edge
            //console.log('vytahuju edge - ' + side);
            this.positionCorner(side);
            this.bringUpEdge(side);
        }
        else if (this.topLayerEdges.indexOf(edgeLoc) !== -1 && this.topLayerCorners.indexOf(cornerLoc) === -1) {// && cornerLoc !== this.f2lGroups[side].corner
            //console.log('vytahuju corner - ' + side);
            this.positionEdge(side);
            this.bringUpCorner(side);
        }
    }

    var f2lsit = this.getF2LSituation(side);

    this.addAlgorithm(this.F2L_ALGORITHMS[f2lsit]);

}

RubiksCube.prototype.getF2LSituation = function (side) {
    this.turnSide(side);

    edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);

    if (cornerLoc === 1 && edgeLoc !== 1) {
        this.prepareEdge(side);
    }
    else {
        this.prepareCorner(side);
    }

    edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    edgeOri = this.getEdgeOrientation(this.f2lGroups[side].edge);
    edgeOri = (side === 'green' || side === 'blue') ? (edgeOri === 0 ? 1 : 0) : edgeOri;
    cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
    cornerOri = this.getCornerOrientation(this.f2lGroups[side].corner);

    return getF2LAlgorithm(cornerLoc, cornerOri, edgeLoc, edgeOri);
}

RubiksCube.prototype.turnSide = function (side) {
    var sideIndex = this.sideIndexes[side];
    var loc = this.getSideLocation(this.sideNumbers[sideIndex]);
    var offset = this.sideNumbers.indexOf(loc);
    offset = offset === 3 ? -1 : offset;
    if (offset) {
        this.addMove(1, 7, offset);
    }
}

RubiksCube.prototype.prepareEdge = function (edge) {
    var edgeNumber = this.f2lGroups[edge].edge;
    var ori = this.getEdgeOrientation(edgeNumber);
    var loc = this.getEdgeLocation(edgeNumber);

    ori = (edge === 'green' || edge === 'blue') ? (ori === 0 ? 1 : 0) : ori;
    ori = (loc === 9 || loc === 3) ? (ori === 0 ? 1 : 0) : ori;
    var preparedLocation = ori === 0 ? 3 : 0;

    var offset = this.topLayerEdges.indexOf(loc);
    if (offset === -1) return;
    var off = offset - preparedLocation;
    off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;

    this.addMove(1, 4, off);
}

RubiksCube.prototype.prepareCorner = function (side) {
    var loc = this.getCornerLocation(this.f2lGroups[side].corner);
    var off = this.topLayerCorners.indexOf(loc);
    if (off === -1) return;
    off = off === 3 ? -1 : off;
    if (off) {
        this.addMove(1, 4, off);
    }
}

RubiksCube.prototype.positionCorner = function (side) {
    var edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    var cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
    var edgeOri = this.getEdgeOrientation(this.f2lGroups[side].edge);
    var cornerOri = this.getCornerOrientation(this.f2lGroups[side].corner);
    var earr = this.topLayerCorners;
    var shift = 0;

    var axis = this.getPartAxis(8 + this.f2lGroups[side].edge, edgeOri);

    edgeOri = (side === 'green' || side === 'blue') ? (edgeOri === 0 ? 1 : 0) : edgeOri;
    edgeOri = (edgeLoc === 10 || edgeLoc === 4) ? (edgeOri === 0 ? 1 : 0) : edgeOri;

    if (cornerOri === 1) {
        shift = edgeOri === 0 ? 1 : 2;
    }
    else if (cornerOri === 2) {
        shift = edgeOri === 0 ? -1 : 2;
    }

    var earr = rotate(earr, shift);
    var off = earr.indexOf(cornerLoc) - this.f2lEdges.indexOf(edgeLoc);
    off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;

    this.addMove(1, 4, off);
    //console.log(this.f2lEdges.indexOf(edgeLoc) + ' ' + this.topLayerCorners.indexOf(cornerLoc));
}

RubiksCube.prototype.getUpperCornerSticker = function (cornerNum) {
    var stickers = this.toStickers();
    var cornerLoc = this.getCornerLocation(cornerNum);
    var face = this.CORNER_TRANSLATION[cornerLoc][0];
    var sticker = this.CORNER_TRANSLATION[cornerLoc][1];
    return stickers[face][sticker];
}

RubiksCube.prototype.getBottomCornerSticker = function (cornerNum) {
    var stickers = this.toStickers();
    var cornerLoc = this.getCornerLocation(cornerNum);
    var face = this.CORNER_TRANSLATION[cornerLoc][0];
    var sticker = this.CORNER_TRANSLATION[cornerLoc][1];
    return stickers[face][sticker];
}

RubiksCube.prototype.getFrontCornerSticker = function (cornerNum) {
    var stickers = this.toStickers();
    var cornerLoc = this.getCornerLocation(cornerNum);
    var face = this.CORNER_TRANSLATION[cornerLoc][2];
    var sticker = this.CORNER_TRANSLATION[cornerLoc][3];
    return stickers[face][sticker];
}


RubiksCube.prototype.getMiddleEdgeSticker = function (edgeNum) {
    var stickers = this.toStickers();
    var edgeLoc = this.getEdgeLocation(edgeNum);
    var face = this.EDGE_TRANSLATION[edgeLoc][0];
    var sticker = this.EDGE_TRANSLATION[edgeLoc][1];
    return stickers[face][sticker];
}

RubiksCube.prototype.getUpperEdgeSticker = function (edgeNum) {
    var stickers = this.toStickers();
    var edgeLoc = this.getEdgeLocation(edgeNum);
    var edgeOri = this.getEdgeOrientation(edgeNum);
    var face = (edgeLoc === 3 || edgeLoc === 9) ? this.EDGE_TRANSLATION[edgeLoc][2] : this.EDGE_TRANSLATION[edgeLoc][0];
    var sticker = (edgeLoc === 3 || edgeLoc === 9) ? this.EDGE_TRANSLATION[edgeLoc][3] : this.EDGE_TRANSLATION[edgeLoc][1];
    return stickers[face][sticker];
}

RubiksCube.prototype.bringUpEdge = function (side) {
    var cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
    var cornerSticker = this.getUpperCornerSticker(this.f2lGroups[side].corner);
    var edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    var edgeSticker = this.getMiddleEdgeSticker(this.f2lGroups[side].edge);
    var face;
    var angle;

    if (edgeSticker === cornerSticker || cornerSticker === 4) {
        face = this.EDGE_TRANSLATION[edgeLoc][0];
    }
    else {
        face = this.EDGE_TRANSLATION[edgeLoc][2];
    }

    var axis = (face === 0 || face === 3) ? 0 : 2;
    var layer = (face === 5 || face === 3) ? 1 : 4;
    if (face === 0 || face === 3) {
        angle = (edgeLoc === 1 || edgeLoc === 7) ? 1 : -1;
    }
    else {
        angle = (edgeLoc === 1 || edgeLoc === 7) ? -1 : 1;
    }

    angle = layer === 1 ? -angle : angle;
    var upangle = (face === 5 || face === 3) ? angle : -angle;
    var distance = Math.abs(this.f2lEdges.indexOf(edgeLoc) - this.topLayerCorners.indexOf(cornerLoc));
    upangle = (distance === 0 || distance === 2) ? upangle : -upangle;

    this.addMove(axis, layer, angle);

    this.addMove(1, 4, upangle);

    this.addMove(axis, layer, -angle);
}

RubiksCube.prototype.positionEdge = function (side) {
    var edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    var cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
    var edgeOri = this.getEdgeOrientation(this.f2lGroups[side].edge);
    var cornerOri = this.getCornerOrientation(this.f2lGroups[side].corner);
    var cornerSticker = this.getUpperCornerSticker(this.f2lGroups[side].corner);
    var edgeSticker = this.getUpperEdgeSticker(this.f2lGroups[side].edge);
    var earr = this.topLayerEdges;
    var shift = 0;

    var axis = this.getPartAxis(8 + this.f2lGroups[side].edge, edgeOri);

    edgeOri = (edgeLoc === 3 || edgeLoc === 9) ? (edgeOri === 0 ? 1 : 0) : edgeOri;

    if (cornerOri === 0) {
        var frontCornerSticker = this.getFrontCornerSticker(this.f2lGroups[side].corner);
        if (frontCornerSticker === edgeSticker) {
            shift = 1;
        }
        else {
            shift = 2;
        }

    }
    else {
        if (edgeSticker === cornerSticker) {
            shift = cornerOri === 2 ? 2 : 1;
        }
        else {
            shift = cornerOri === 2 ? 0 : -1;
        }
    }


    var earr = rotate(earr, shift);
    var off = earr.indexOf(edgeLoc) - this.bottomLayerCorners.indexOf(cornerLoc);
    off = Math.abs(off) == 3 ? (off < 0 ? 1 : -1) : off;

    this.addMove(1, 4, off);
}

RubiksCube.prototype.bringUpCorner = function (side) {
    var cornerLoc = this.getCornerLocation(this.f2lGroups[side].corner);
    var cornerOri = this.getCornerOrientation(this.f2lGroups[side].corner);
    var cornerSticker = this.getUpperCornerSticker(this.f2lGroups[side].corner);
    var frontCornerSticker = this.getFrontCornerSticker(this.f2lGroups[side].corner);
    var edgeLoc = this.getEdgeLocation(this.f2lGroups[side].edge);
    var edgeSticker = this.getUpperEdgeSticker(this.f2lGroups[side].edge);
    var face;
    var angle, upangle;

    if (cornerOri !== 0) {
        if (frontCornerSticker === 4) {
            face = this.CORNER_TRANSLATION[cornerLoc][2];
        }
        else {
            face = this.CORNER_TRANSLATION[cornerLoc][4];
        }

        var axis = (face === 0 || face === 3) ? 0 : 2;
        var layer = (face === 5 || face === 3) ? 1 : 4;
        if (face === 0 || face === 3) {
            angle = (cornerLoc === 1 || cornerLoc === 5) ? 1 : -1;
        }
        else {
            angle = (cornerLoc === 1 || cornerLoc === 5) ? -1 : 1;
        }

        angle = layer === 1 ? -angle : angle;
        upangle = 2;
    } else {
        if (edgeSticker === frontCornerSticker) {
            face = this.CORNER_TRANSLATION[cornerLoc][2];
        }
        else {
            face = this.CORNER_TRANSLATION[cornerLoc][4];
        }

        var axis = (face === 0 || face === 3) ? 0 : 2;
        var layer = (face === 5 || face === 3) ? 1 : 4;
        if (face === 0 || face === 3) {
            angle = (cornerLoc === 1 || cornerLoc === 5) ? 1 : -1;
        }
        else {
            angle = (cornerLoc === 1 || cornerLoc === 5) ? -1 : 1;
        }

        angle = layer === 1 ? -angle : angle;
        upangle = 1;
    }


    this.addMove(axis, layer, angle);

    this.addMove(1, 4, upangle);

    this.addMove(axis, layer, -angle);
}

function getF2LAlgorithm(cornerLoc, cornerOri, edgeLoc, edgeOri) {
    if (cornerLoc === 0) {
        switch (cornerOri) {
            case 0:
                switch (edgeLoc) {
                    case 0:
                        return edgeOri === 0 ? 24 : 17;
                    case 3:
                        return edgeOri === 0 ? 19 : 22;
                    case 6:
                        return edgeOri === 0 ? 20 : 21;
                    case 9:
                        return edgeOri === 0 ? 23 : 18;
                    case 1:
                        return edgeOri === 0 ? 32 : 31;
                }
                break;
            case 1:
                switch (edgeLoc) {
                    case 0:
                        return edgeOri === 0 ? 11 : 1;
                    case 3:
                        return edgeOri === 0 ? 5 : 9;
                    case 6:
                        return edgeOri === 0 ? 3 : 7;
                    case 9:
                        return edgeOri === 0 ? 15 : 13;
                    case 1:
                        return edgeOri === 0 ? 33 : 35;
                }
                break;
            case 2:
                switch (edgeLoc) {
                    case 0:
                        return edgeOri === 0 ? 16 : 14;
                    case 3:
                        return edgeOri === 0 ? 4 : 8;
                    case 6:
                        return edgeOri === 0 ? 6 : 10;
                    case 9:
                        return edgeOri === 0 ? 12 : 2;
                    case 1:
                        return edgeOri === 0 ? 34 : 36;
                }
                break;
        }
    }
    else if (cornerLoc === 1) {
        switch (cornerOri) {
            case 0:
                switch (edgeLoc) {
                    case 0:
                        return 25;
                    case 9:
                        return 26;
                    case 1:
                        return edgeOri === 0 ? 37 : 38;
                }
                break;
            case 1:
                switch (edgeLoc) {
                    case 0:
                        return 30;
                    case 9:
                        return 28;
                    case 1:
                        return edgeOri === 0 ? 40 : 42;
                }
                break;
            case 2:
                switch (edgeLoc) {
                    case 0:
                        return 27;
                    case 9:
                        return 29;
                    case 1:
                        return edgeOri === 0 ? 39 : 41;
                }
                break;
        }
    }
    return -1;
}

RubiksCube.prototype.getOLLArray = function () {
    var arr = [];
    var stickers = this.toStickers();
    for (var i = 0; i < this.sideNumbers.length; i++) {
        for (var j = 0; j < 3; j++) {
            arr.push(stickers[this.sideNumbers[i]][j] === 1 ? 1 : 0);
        }
    }
    return arr;
}

RubiksCube.prototype.getOLLSituation = function () {
    var oll = this.getOLLArray();
    for (var index in this.OLL_CASES) {
        for (var i = 0; i < 4; i++) {
            if (oll.join("").localeCompare(rotate(this.OLL_CASES[index], -3 * i).join("")) === 0) {
                var off = i === 3 ? -1 : i;
                if (off) {
                    this.addMove(1, 4, off);
                }
                return index;
            }
        }
    }
}

RubiksCube.prototype.getPLLPattern = function () {
    var loc = this.getSideLocation(this.sideNumbers[0]);
    var offset = this.sideNumbers.indexOf(loc);
    var locations = [];
    var pattern = [];
    var partLoc;

    var cl = this.clone();
    var count = 0;
    var max = 0;
    var maxIndex = 0;
    var bestPattern = [];
    var exception = false;
    var neighborParts = false;

    for (var index = 0; index < 4; index++) {
        locations = [];
        pattern = [];
        exception = false;
        neighborParts = false;

        for (var i = 0; i < this.upperLayerParts.length; i++) {
            partLoc = i % 2 ? cl.getEdgeLocation(this.upperLayerParts[i]) : cl.getCornerLocation(this.upperLayerParts[i]);
            locations.push(partLoc);
        }
        locations = rotate(locations, -2 * offset);
        for (var i = 0; i < locations.length; i++) {
            pattern.push(locations[i] === this.upperLayerParts[i] ? 1 : 0);
            if (i > 0 && pattern[i - 1] === 1 && pattern[i] === 1) {
                neighborParts = true;
            }
        }

        count = countInArray(pattern, 1);

        if (max <= 2 && count === 2 && neighborParts) {
            exception = true;
        }

        if (count === 4 && pattern[0] === 1) {
            exception = true;
        }

        if (count > max || exception) {
            max = count;
            maxIndex = index;
            bestPattern = pattern;
        }

        cl.transform(1, 4, 1);
    }
    return { maxIndex: maxIndex, bestPattern: bestPattern };
}

RubiksCube.prototype.getPLLSituation = function (pattern) {
    for (var key in this.PLL_PATTERNS) {
        for (var i = 0; i < 4; i++) {
            if (pattern.join("").localeCompare(rotate(this.PLL_PATTERNS[key], -2 * i).join("")) === 0) {
                var off = i === 3 ? -1 : i;
                if (off) {
                    this.addMove(1, 7, off);
                }

                var frontside = this.getSideAt(2);
                var backside = this.getSideAt(5);

                if (key === "Gab") {
                    return this.toStickers()[3][2] === frontside ? "Gb" : "Ga";
                }
                else if (key === "Gcd") {
                    return this.toStickers()[0][0] === frontside ? "Gd" : "Gc";
                }
                else if (key === "U") {
                    return this.toStickers()[0][1] === backside ? "Ua" : "Ub";
                }
                else if (key === "A") {
                    return this.toStickers()[2][2] === backside ? "Aa" : "Ab";
                }
                else if (key === "H") {
                    if (this.toStickers()[2][1] === backside) {
                        return "H";
                    }
                    else {
                        if (this.toStickers()[0][1] === backside) {
                            this.addMove(1, 7, 1);
                        }
                        return "Z";
                    }
                }

                return key;
            }
        }
    }
}


// small functions
var permArr = [], usedChars = [];

function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr;
};

function getKey(obj, value) {
    for (var key in obj) {
        if (obj[key] == value && key != 'offset') {
            return key;
        }
    }
    return null;
};

function rotate(arr, n) {
    return arr.slice(n, arr.length).concat(arr.slice(0, n));
}

function intersection(a, b) {
    return a.filter(function (n) {
        return b.indexOf(n) != -1
    });
}

function parseNotation(alg) {
    alg = alg.replace(/[()\s]/g, '');
    return alg.split(/(?=[a-zA-Z])/);
}

function mod(n, m) {
    return ((m % n) + n) % n;
}

function countInArray(arr, elem) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) count++;
    }
    return count;
}

function beautifyMoves(moves) {
    var oldmoves = moves;
    for (var i = 1; i < moves.length; i++) {
        if (moves[i].axis == moves[i - 1].axis && moves[i].layer == moves[i - 1].layer) {
            moves[i].angle += moves[i - 1].angle;
            moves[i].angle = Math.abs(moves[i].angle) == 3 ? (moves[i].angle < 0 ? 1 : -1) : moves[i].angle;
            if (moves[i].angle == 0 || moves[i].angle == 4) {
                moves.splice(i - 1, 2);
            }
            else {
                moves.splice(i - 1, 1);
            }
        }
    }

    return moves.length === oldmoves.length ? moves : beautifyMoves(moves);
}

function getWhiteEdgeIndex(ax, layer) {
    if (ax == 0 && layer == 4) {
        return 0;
    } else if (ax == 2 && layer == 1) {
        return 1;
    } else if (ax == 0 && layer == 1) {
        return 2;
    } else if (ax == 2 && layer == 4) {
        return 3;
    }
}

function countRealMoves(arr) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].layer !== 7) {
            count++;
        }
    }
    return count;
}