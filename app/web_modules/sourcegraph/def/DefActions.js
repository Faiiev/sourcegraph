// @flow

import type {Def, Ref} from "sourcegraph/def";

export class WantDef {
	repo: string;
	rev: ?string;
	def: string;

	constructor(repo: string, rev: ?string, def: string) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
	}
}

export class DefFetched {
	repo: string;
	rev: ?string;
	def: string;
	defObj: Def;

	constructor(repo: string, rev: ?string, def: string, defObj: Def) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.defObj = defObj;
	}
}

export class WantDefAuthors {
	repo: string;
	rev: ?string;
	def: string;

	constructor(repo: string, rev: ?string, def: string) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
	}
}

export class DefAuthorsFetched {
	repo: string;
	rev: ?string;
	def: string;
	authors: Object;

	constructor(repo: string, rev: ?string, def: string, authors: Object) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.authors = authors;
	}
}

export class WantDefs {
	repo: string;
	rev: ?string;
	query: string;
	filePathPrefix: ?string;
	overlay: boolean;

	constructor(repo: string, rev: ?string, query: string, filePathPrefix?: string, overlay: boolean) {
		this.repo = repo;
		this.rev = rev;
		this.query = query;
		this.filePathPrefix = filePathPrefix || null;
		this.overlay = overlay; // For metrics purposes
	}
}

export class DefsFetched {
	repo: string;
	rev: ?string;
	query: string;
	defs: Array<Def>;
	filePathPrefix: ?string;
	overlay: boolean;

	constructor(repo: string, rev: ?string, query: string, filePathPrefix: ?string, defs: Array<Def>, overlay: boolean) {
		this.repo = repo;
		this.rev = rev;
		this.query = query;
		this.filePathPrefix = filePathPrefix;
		this.defs = defs;
		this.overlay = overlay;
	}
}

export class SelectDef {
	repo: string;
	rev: ?string;
	def: string;
	eventName: string;

	constructor(repo: string, rev: ?string, def: string) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.eventName = "SelectDef";
	}
}

export class HighlightDef {
	url: ?string;
	eventName: string;

	constructor(url: ?string) {
		this.url = url;
		this.eventName = "HighlightDef";
	}
}

export class WantRefLocations {
	repo: string;
	rev: ?string;
	def: string;
	reposOnly: bool;

	constructor(repo: string, rev: ?string, def: string, reposOnly: ?bool) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.reposOnly = (reposOnly === true);
	}
}

export class RefLocationsFetched {
	repo: string;
	rev: ?string;
	def: string;
	reposOnly: bool;
	locations: Array<Object>;

	constructor(repo: string, rev: ?string, def: string, reposOnly: bool, locations: Array<Object>) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.reposOnly = reposOnly;
		this.locations = locations;
	}
}

export class WantRefs {
	repo: string;
	rev: ?string;
	def: string;
	refRepo: string; // return refs from files in this repo
	refFile: ?string; // only return refs in this file

	constructor(repo: string, rev: ?string, def: string, refRepo: string, refFile: ?string) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.refRepo = refRepo;
		this.refFile = refFile || null;
	}
}

export class RefsFetched {
	repo: string;
	rev: ?string;
	def: string;
	refRepo: string;
	refFile: ?string;
	refs: Array<Ref>;

	constructor(repo: string, rev: ?string, def: string, refRepo: string, refFile: ?string, refs: Array<Ref>) {
		this.repo = repo;
		this.rev = rev;
		this.def = def;
		this.refRepo = refRepo;
		this.refFile = refFile || null;
		this.refs = refs;
	}
}
