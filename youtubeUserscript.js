(() => {
    class AssertionError extends Error {
        name = "AssertionError";
    }
    function assert (expr, msg) {
        if (!expr)
            throw new AssertionError(msg);
    }
    function $ (selector, root = document) {
        return root.querySelector(selector);
    }
    function assertIsVideoMicroformatData (value) {
        assert(value && typeof value === "object", "Expected data object");
        assert("uploadDate" in value &&
            typeof value.uploadDate === "string", "Expected upload date string");
    }
    function getVideoMicroformatData () {
        const scriptElement = $("ytd-player-microformat-renderer > script[type='application/ld+json']");
        assert(scriptElement?.textContent, "Structured video data not found");
        const microformatData = JSON.parse(scriptElement.textContent);
        assertIsVideoMicroformatData(microformatData);
        return microformatData;
    }
    function getDateParts (data) {
        assert((/^\d{4}-\d{2}-\d{2}$/).test(data.uploadDate), "Unexpected upload date format");
        return data.uploadDate.split("-").map(Number);
    }
    function formatDateParts (dateParts) {
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toLocaleDateString("en-US", {dateStyle: "medium"});
    }
    function updateVideoDescriptionDate (relativeDateElement) {
        const data = getVideoMicroformatData();
        const dateParts = getDateParts(data);
        const formatted = formatDateParts(dateParts);
        relativeDateElement.textContent = formatted;
    }
    const RELATIVE_DATE_ELEMENT_SELECTOR = "#description #info-container > yt-formatted-string > span:nth-of-type(3)";
    function main () {
        const observerTargetNode = $("#description #info-container");
        assert(observerTargetNode, "Target node not found");
        const init = {childList: true, subtree: true};
        const observer = new MutationObserver(handler);
        const pause = () => {
            observer.disconnect();
            return () => observer.observe(observerTargetNode, init);
        };
        pause()();
        function handler (records) {
            topLoop: for (const record of records) {
                switch (record.type) {
                    case "childList": {
                        for (const node of record.addedNodes) {
                            if (node.nodeType === Node.TEXT_NODE &&
                                node.parentElement?.matches(RELATIVE_DATE_ELEMENT_SELECTOR)) {
                                const resume = pause();
                                updateVideoDescriptionDate(node.parentElement);
                                resume();
                                break topLoop;
                            }
                            else if (node.nodeName === "SPAN" &&
                                node.matches(RELATIVE_DATE_ELEMENT_SELECTOR)) {
                                updateVideoDescriptionDate(node);
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
