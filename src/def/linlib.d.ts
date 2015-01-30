declare module LinLib {
    export function parseMatrix(str : String) : Matrix;
    export function parseVector(str : String) : Vector;
    export function parseVectors(str : String) : Vector[];
    export function parseFraction(str : String) : Fraction;
    export function changeOfBaseMatrix(alpha : Vector, beta : Vector) : Matrix;
    export function leastSquares(a : Matrix, b : Vector) : Vector;
    export function matrixFromNumberArray(arr : number[][]) : Matrix;
    export function rowVecsToMatrix(vecs : Vector[]) : Matrix;
    export function colVecsToMatrix(vecs : Vector[]) : Matrix;
    export function orthogonalToSubspace(vecs : Vector[], v : Vector) : boolean;
    export function projectSubspace(vec : Vector, vecs : Vector[]) : Vector;
    export function identity(n : number) : Matrix;
    export function bestFitLine(points : Vector[]) : Vector;
    export function zero(n : number, m : number) : Matrix;

    class Matrix {
        constructor(arr : Fraction[][]);
        toString() : string;
        scale(s : number) : Matrix;
        transpose() : Matrix;
        pow(n : number) : Matrix;
        sub(m : Matrix) : Matrix;
        add(m : Matrix) : Matrix;
        mult(m : Matrix) : Matrix;
        determinant() : Matrix;
        getDiagonalVector() : Vector;
        removeCross(i : number, j : number) : Matrix;
        gaussJordan() : Matrix;
        gauss() : Matrix;
        invert() : Matrix;
        addScaledRowToRow(i : number, s : Fraction, j : number) : Matrix;
        addRowToRow(i : number, j : number) : Matrix;
        scaleRow(i : number, s : Fraction) : Matrix;
        swapRows(i : number, j : number) : Matrix;
        augmentRow(v : Vector) : Matrix;
        augmentCol(v : Vector) : Matrix;
        rowVectors() : Vector[];
        columnVectors() : Vector[];
        toArray() : Fraction[][];
        rowCount() : number;
        colCount() : number;
        normalize(n : number) : Matrix;
        forEachElement(f : Function) : Matrix;
        eq(m : Matrix) : boolean;
        get(i : number, j : number) : Fraction;
        convolve(m : Matrix) : Matrix;
    }

    class Vector {
        constructor(arr : Fraction[]);
        toString() : string;
        hasZero() : boolean;
        eq(v : Vector) : boolean;
        scale(s : Fraction) : Vector;
        proj(v : Vector) : Vector;
        lengthSq() : Fraction;
        distSq(v : Vector) : Fraction;
        dot(v : Vector) : Fraction;
        sub(v : Vector) : Vector;
        add(v : Vector) : Vector;
        toArray() : Fraction[];
        get(i : number) : Fraction;
        dim() : number;
    }

    class Fraction {
        constructor(num : number, den : number);
        toString() : string;
        eq(f : Fraction) : boolean;
        isZero() : boolean;
        negate() : Fraction;
        toDec() : number;
        invert() : Fraction;
        div(f : Fraction) : Fraction;
        mult(f : Fraction) : Fraction;
        sub(f : Fraction) : Fraction;
        add(f : Fraction) : Fraction;
        getDen() : number;
        getNum() : number;
        static make(num : number, den : number) : Fraction;
    }
}