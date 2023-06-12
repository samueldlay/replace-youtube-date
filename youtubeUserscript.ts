(() => {
  type JsonValue =
    | boolean
    | number
    | null
    | string
    | JsonValue[]
    | {[key: string]: JsonValue | undefined};

  class AssertionError extends Error {
    override name = "AssertionError";
  }

  function assert (expr: unknown, msg?: string): asserts expr {
    if (!expr) throw new AssertionError(msg);
  }

  function $<T extends Element = Element> (
    selector: string,
    root: ParentNode = document,
  ): T | null {
    return root.querySelector(selector);
  }

  // function $$<T extends Element = Element>(
  //   selector: string,
  //   root: ParentNode = document,
  // ): T[] {
  //   return [...root.querySelectorAll<T>(selector)];
  // }

  type YTVideoData = {
    /** YYYY-MM-DD */
    uploadDate: string;
  };

  function assertIsVideoMicroformatData<T extends JsonValue> (
    value: T,
  ): asserts value is T & YTVideoData {
    assert(
      value && typeof value === "object",
      "Expected data object",
    );

    assert(
      "uploadDate" in value &&
      typeof value.uploadDate === "string",
      "Expected upload date string",
    );
  }

  function getVideoMicroformatData (): YTVideoData {
    const scriptElement = $<HTMLScriptElement>(
      "ytd-player-microformat-renderer > script[type='application/ld+json']",
    );

    assert(scriptElement?.textContent, "Structured video data not found");
    const microformatData: JsonValue = JSON.parse(scriptElement.textContent);
    assertIsVideoMicroformatData(microformatData);
    return microformatData;
  }

  type DateParts = [
    year: number,
    month: number,
    dayOfMonth: number,
  ];

  function getDateParts (data: YTVideoData): DateParts {
    assert(
      (/^\d{4}-\d{2}-\d{2}$/).test(data.uploadDate),
      "Unexpected upload date format",
    );
    return data.uploadDate.split("-").map(Number) as [number, number, number];
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
  function formatDateParts (dateParts: DateParts): string {
    return new Date(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2],
    ).toLocaleDateString("en-US", {dateStyle: "medium"});
  }

  function updateVideoDescriptionDate (relativeDateElement: HTMLElement): void {
    const data = getVideoMicroformatData();
    const dateParts = getDateParts(data);
    const formatted = formatDateParts(dateParts);
    relativeDateElement.textContent = formatted;
  }

  const RELATIVE_DATE_ELEMENT_SELECTOR =
    "#description #info-container > yt-formatted-string > span:nth-of-type(3)";

  function main () {
    const observerTargetNode = $<HTMLDivElement>("#description #info-container");
    assert(observerTargetNode, "Target node not found");

    const init: MutationObserverInit = {childList: true, subtree: true};
    const observer = new MutationObserver(handler);

    /** @returns "resume" fn */
    const pause = () => {
      observer.disconnect();
      return () => observer.observe(observerTargetNode, init);
    };

    pause()();

    function handler (records: readonly MutationRecord[]): void {
      topLoop: for (const record of records) {
        switch (record.type) {
          case "childList": {
            for (const node of record.addedNodes) {
              if (
                node.nodeType === Node.TEXT_NODE &&
                node.parentElement?.matches(RELATIVE_DATE_ELEMENT_SELECTOR)
              ) {
                // Prevent a loop while updating the text content of the node
                const resume = pause();
                updateVideoDescriptionDate(node.parentElement);
                resume();
                break topLoop;
              } else if ( // The span element is initially created when the first video is loaded
                node.nodeName === "SPAN" &&
                (node as HTMLSpanElement).matches(RELATIVE_DATE_ELEMENT_SELECTOR)
              ) {
                updateVideoDescriptionDate(node as HTMLSpanElement);
                break topLoop;
              }
            }
          }
        }
      }
    }
  }

  main();
})();
