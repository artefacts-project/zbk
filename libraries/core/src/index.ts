export type Position = { pos: number };

export type Range = { start: number; end: number };

export type Paragraph = { index: number };

export type SpatialQuadLayout = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type Directions = SpatialQuadLayout; // "Outer" relations, hints for a not yet known interpreter

export type ZettelMarks = Position | Range | Paragraph;

export type Marks = ZettelMarks; // "Inner" relations, symbols/marks for the block they are attached to

export type TextBlock = {
    text: string;
};

export type Suggestion = "temporal" | "spatial" | "sequential";

export type Mark = {
    map: Marks; // + "Whole" to mark whole Zettel? Useful for Relation?
    artefact: Zettel;
    text: string; // necessary?
};

export type Direction = {
    map: Directions;
    artefact: Zettel | Mark | Relation;
    text: string;
};

export type Mappa = Mark | Direction;

// deliberately sequential but can be represented temporal
export type Zettel = {
    links: (TextBlock | Zettel | Relation)[]; //only if "text" property exists?
    text: string;
};

// deliberately spatial, but can be represented sequentially or temporally,
export type Relation = {
    links: Direction[];
    text: string;
};

// primarily temporal, but can be represented sequentially and can still make sense (like a catalogue)
// where diffs make most sense, because links overlap to some degree => one zettel is part of more relations
export type Index = {
    links: Relation | Zettel;
    text: string;
};
