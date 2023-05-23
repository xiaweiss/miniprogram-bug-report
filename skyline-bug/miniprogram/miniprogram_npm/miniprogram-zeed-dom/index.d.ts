declare const inspect: unique symbol;
declare class VNode {
    static ELEMENT_NODE: number;
    static TEXT_NODE: number;
    static CDATA_SECTION_NODE: number;
    static PROCESSING_INSTRUCTION_NODE: number;
    static COMMENT_NODE: number;
    static DOCUMENT_NODE: number;
    static DOCUMENT_TYPE_NODE: number;
    static DOCUMENT_FRAGMENT_NODE: number;
    _parentNode: any;
    _childNodes: any[];
    get nodeType(): number;
    get nodeName(): string;
    get nodeValue(): string | null;
    constructor();
    cloneNode(deep?: boolean): any;
    _fixChildNodesParent(): void;
    insertBefore(newNode: VNode, node?: VNode): void;
    appendChild(node: VNode | VNode[] | string | string[] | null | undefined): void;
    append: (node: VNode | VNode[] | string | string[] | null | undefined) => void;
    removeChild(node: {
        _parentNode: null;
    }): void;
    remove(): this;
    replaceChildren(...nodes: any[]): void;
    replaceWith(...nodes: any[]): void;
    _indexInParent(): any;
    get parentNode(): any;
    get childNodes(): any[];
    get children(): any[];
    get firstChild(): any;
    get lastChild(): any;
    get nextSibling(): any;
    get previousSibling(): any;
    flatten(): VElement[];
    flattenNodes(): VNode[];
    render(): string;
    get textContent(): string | null;
    set textContent(text: string | null);
    contains(otherNode: this): boolean;
    get ownerDocument(): any;
    toString(): string;
    [inspect](): string;
}
declare class VTextNode extends VNode {
    _text: string;
    get nodeType(): number;
    get nodeName(): string;
    get nodeValue(): string | null;
    get textContent(): string | null;
    constructor(text?: string);
    render(): string;
    cloneNode(deep?: boolean): any;
}
declare class VNodeQuery extends VNode {
    getElementById(name: string): VElement | undefined;
    getElementsByClassName(name: any): VElement[];
    matches(selector: string): boolean;
    querySelectorAll(selector: any): VElement[];
    querySelector(selector: string): VElement | undefined;
    parent(selector: string): any;
    handle(selector: any, handler: (arg0: VElement, arg1: number) => void): void;
}
declare class VElement extends VNodeQuery {
    _originalTagName: string;
    _nodeName: any;
    _attributes: Record<string, string>;
    _styles: any;
    get nodeType(): number;
    get nodeName(): any;
    constructor(name?: string, attrs?: {});
    cloneNode(deep?: boolean): any;
    get attributes(): Record<string, string>;
    _findAttributeName(name: string): string | null;
    setAttribute(name: string, value: string): void;
    getAttribute(name: string): string | null;
    removeAttribute(name: string | number): void;
    hasAttribute(name: any): boolean;
    get style(): any;
    get tagName(): any;
    get id(): string | null;
    set id(value: string | null);
    get src(): string | null;
    set src(value: string | null);
    getElementsByTagName(name: string): VElement[];
    setInnerHTML(html: string): void;
    get innerHTML(): string;
    set innerHTML(html: string);
    get outerHTML(): any;
    get className(): string;
    set className(name: string | string[]);
    get classList(): {
        contains(s: any): boolean;
        add(s: any): void;
        remove(s: any): void;
    };
    render(h?: any): any;
}
declare class VDocType extends VNode {
    name: any;
    publicId: any;
    systemId: any;
    get nodeName(): string;
    get nodeValue(): string | null;
    get nodeType(): number;
    render(): string;
}
declare class VDocumentFragment extends VNodeQuery {
    docType: VDocType;
    get nodeType(): number;
    get nodeName(): string;
    render(h?: any): string;
    get innerHTML(): string;
    createElement(name: string, attrs?: {}): VElement;
    createDocumentFragment(): VDocumentFragment;
    createTextNode(text?: string): VTextNode;
}
declare class VDocument extends VDocumentFragment {
    get nodeType(): number;
    get nodeName(): string;
    get documentElement(): any;
    render(h?: any): string;
}
declare class VHTMLDocument extends VDocument {
    constructor(empty?: boolean);
    get body(): VElement;
    get title(): string;
    set title(title: string);
    get head(): VElement;
}
declare function createDocument(): VDocument;
declare function createHTMLDocument(): VHTMLDocument;
declare let document: VDocument;
declare let h: any;

interface Context {
    h?: any;
    document: VDocument | VDocumentFragment;
}
declare function hArgumentParser(tag: any, attrs: any, ...children: any[]): {
    tag: any;
    attrs: any;
    children: any[];
};
declare function hFactory(context: Context): any;

declare function removeBodyContainer(body: VNodeQuery): VNodeQuery;

declare function vdom(obj?: VNode | Buffer | string | null): VNode;
declare function parseHTML(html: string): VDocumentFragment | VHTMLDocument;

declare const escapeHTML: (text: string) => string;
declare const unescapeHTML: (html: string) => string;

declare function tidyDOM(document: VDocument): void;

declare const CDATA: (s: string) => string;
declare function html(itag: string, iattrs?: object, ...ichildren: any[]): string;
declare namespace html {
    var firstLine: string;
    var html: boolean;
}

declare function xml(itag: string, iattrs?: object, ...ichildren: any[]): string;
declare namespace xml {
    var firstLine: string;
    var xml: boolean;
}

export { CDATA, VDocType, VDocument, VDocumentFragment, VElement, VHTMLDocument, VNode, VNodeQuery, VTextNode, createDocument, createHTMLDocument, document, escapeHTML, h, hArgumentParser, hFactory, html, parseHTML, removeBodyContainer, tidyDOM, unescapeHTML, vdom, xml };
