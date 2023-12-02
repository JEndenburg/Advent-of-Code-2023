import TrebuchetCalibrationRecoverer from "./trebuchet-calibration-recoverer.js";

export default function() {
    function execute() {
        const recoverer = new TrebuchetCalibrationRecoverer();
        const result = recoverer.recoverDocument($("#input").val(), $("#include-words")[0].checked);
        $("#output").val(result)
    }

    $("#input").on("change", () => execute());
    $("#include-words").on("change", () => execute());
};