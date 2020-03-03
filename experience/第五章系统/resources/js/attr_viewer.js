$(document).ready(function() {
    $("#workflow").on('click', '.node', function () {
        // console.log(click);
        var name = $(this).attr("name");
        var input = $(this).attr("input");
        $("#name").html(name);
        if (input == undefined) {
            $("#input").html('');
        } else
            $("#input").html(input);
        var output = $(this).attr("output");
        if (output == undefined) {
            $("#output").html('');
        } else
            $("#output").html(output);
        // $("#input").html(input);
        // $("#output").html(output);
    })
})
