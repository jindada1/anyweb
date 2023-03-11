function readLocalFile(cb, error) {
    var input = document.createElement("input");
    input.type = "file";

    input.onchange = (e) => {
        const input = e.target;

        if (input.files === null || input.files.length === 0) {
            error("files is null");
            return;
        }
        const file = input.files[0];
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        // here we tell the reader what to do when it's done reading...
        reader.onload = (readerEvent) => {
            if (readerEvent.target === null) {
                error("readerEvent.target is null");
                return;
            }
            var content = readerEvent.target.result; // this is the content!
            cb(file, content);
        };
    };

    input.click();
}
