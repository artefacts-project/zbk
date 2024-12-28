/*
 *               Basic blocks
 */

export interface TextBlock {
  text: string;
}

export interface HashTag {
  text: `#${string}`; //needs to be validated at runtime
}

export type Block = TextBlock | HashTag;

/*
 *               Marks and Directions
 */

export interface Position {
  pos: number;
}

export interface Range {
  start: number;
  end: number;
}

export interface Paragraph {
  index: number;
}

export interface Spatial2dBoxLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Mark = Position | Range | Paragraph;

export type Direction = Spatial2dBoxLayout;

export interface Sample {
  samples: Zettel[];
}

/*
 *               Mappa
 */

export interface ZettelMappa {
  map: Mark;
  artefact: Zettel;
}

export interface DirectionMappa {
  map: Direction;
  artefact: Zettel;
}

export interface RelationMappa {
  map: Sample;
  artefact: Relation;
}

/*
 *               Relations
 */

export interface ZettelRelation {
  links: DirectionMappa[];
}

// SampleRelation and ExpandedRelation could be redundant in combination with ZettelRelation
export interface SampleRelation {
  sample: RelationMappa | Relation;
}

export type ExpandedRelation = ZettelRelation & SampleRelation;

export type Relation = (ZettelRelation | SampleRelation | ExpandedRelation) & { meta?: Zettel };

/*
 *               Zettel and Artefact
 */

export type ZettelParts = Block | Fold | Zettel;

export type Zettel<T extends ZettelParts[] | undefined = undefined> = T extends undefined
  ?
      | {
          parts: (Block | Fold | Zettel)[]; // can't use ZettelParts here because of circular dependency
          timestamp: number;
        }
      | ZettelMappa
  : {
      parts: Exclude<T, undefined>;
      timestamp: number;
    };

// alternative without circular depedency, but TypeScript throws "Type instantiation is excessively deep and possibly infinite."
// export interface ZettelBase<T extends ZettelParts[] | undefined = undefined> {
//   parts: T extends undefined ? ZettelParts[] : Exclude<T, undefined>;
// }

// export type Zettel<T extends ZettelParts[] | undefined = undefined> = T extends undefined
//   ? ZettelBase | ZettelMappa
//   : Zettel<Exclude<T, undefined>>;

export type Artefact = Zettel | Relation | Fold; //needs SameInstanceZettel too?

/*
 *               Derivations/Folds/Condensations
 */

export type FoldTypes<T extends ZettelParts[] | undefined = undefined> = T extends undefined
  ? Block | Zettel
  : Zettel<Exclude<T, undefined>>;

export interface ArtefactFold<
  T extends Artefact | undefined = undefined,
  K extends FoldTypes | undefined = undefined
> {
  fold: K extends undefined ? FoldTypes : Exclude<K, undefined>;
  artefact: T extends undefined ? Artefact : Exclude<T, undefined>;
}

export type ListFold = {
  fold: FoldTypes;
  list: List | MultiList;
};

//TODO: check if this can be simplified
export type Fold<
  T extends Artefact | undefined = undefined,
  K extends FoldTypes | undefined = undefined
> = T extends undefined
  ? K extends undefined
    ? ArtefactFold<undefined, undefined> | ListFold
    : ArtefactFold<undefined, Exclude<K, undefined>>
  : K extends undefined
    ? ArtefactFold<Exclude<T, undefined>, undefined>
    : ArtefactFold<Exclude<T, undefined>, Exclude<K, undefined>>;

/*
 *               Organization tools with less focus on Relations
 */

export type List = (Zettel | Fold)[]; //needs SameInstanceZettel too?

export type MultiList = {
  text: TextBlock;
  list: List;
}[];

/*
 *               Specific Lists and Folds
 */

export type SameInstanceZettel = Zettel & { __brand: "sameInstance" };

export type EnrichedZettel = [
  Fold<SameInstanceZettel, TextBlock>,
  SameInstanceZettel,
  Fold<SameInstanceZettel, Zettel<HashTag[]>>
];

// test if this works better than having it as a property on Relation
export type MetaZettel = ArtefactFold<Relation, Zettel>;

/*
 *               Indices and Catalogues
 */

export type Suggestion = "temporal" | "spatial" | "sequential" | "parallel";

export type IndexEntry = {
  artefact: Artefact | IndexEntry;
  suggestion: Suggestion;
};

export type Index = {
  entries: IndexEntry[];
};

export type CatalogueEntry = {
  artefact: Artefact | CatalogueEntry;
  suggestion: Suggestion;
  description: TextBlock;
};

export type Catalogue = {
  entries: CatalogueEntry[];
};
