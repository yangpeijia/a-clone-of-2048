function showNumberWithAnimation(i, j, randNumber) {
    var the_number_cell = $("#number-cell-" + i + "-" + j);
    the_number_cell.css('background-color', getNumberBackgroundColor(randNumber));
    the_number_cell.css('color', getNumberColor(randNumber));
    the_number_cell.text(randNumber);

    the_number_cell.animate({
        width: cell_side_length,
        height: cell_side_length,
        left: getPosLeft(i, j),
        top: getPosTop(i, j)
    }, 50)

}

function showMoveAnimation(fromx, fromy, tox, toy) {
    var the_number_cell = $("#number-cell-" + fromx + "-" + fromy);
    the_number_cell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 100);
}

function updateScore(score) {
    $("#score").text(score);
}