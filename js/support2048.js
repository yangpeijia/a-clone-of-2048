var document_width=window.screen.availWidth;
var grid_container_width=0.92*document_width;
var cell_side_length=0.18*document_width;
var cell_space=0.04*document_width;

function getPosTop(i,j){
    return cell_space+i*(cell_side_length+cell_space);
   
}
function getPosLeft(i,j){
    return cell_space+j*(cell_side_length+cell_space);
}

function getNumberBackgroundColor(number){
    switch(number){
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#fb7c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
    }
    return "black";        
} 

function getNumberColor(number){
    if(number<=4){
        return "#776e50";
    }else{
        return "white";
    }
}

function noSpace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}

function canMoveLeft(board){
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                if(board[i][j-1]==0||board[i][j-1]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<3;j++){
            if(board[i][j]!=0){
                if(board[i][j+1]==0||board[i][j+1]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board){
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                if(board[i-1][j]==0||board[i-1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board){
    for(var i=0;i<3;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                if(board[i+1][j]==0||board[i+1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row,col1,col2,board){
    for(var i=col1+1; i<col2; i++){
        if(board[row][i]!=0){
            return false;
        }
    }
    return true;
}

function noBlockVertical(col,row1,row2,board){
    for(var i=row1+1; i<row2; i++){
        if(board[i][col]!=0){
            return false;
        }
    }
    return true;
}

function noMove(board){
    if(canMoveLeft(board)||canMoveRight(board)||canMoveDown(board)||canMoveUp(board)){
        return false;
    }else{
        return true;
    }
}

function loadBestScore(){
    best_score=localStorage.getItem("best_score")
    if(best_score){
         $("#best-score").text(best_score);
    }
}

function updateBestScore(score){
    localStorage.setItem("best_score",score);
    $("#best-score").text(score);
}


function closeWindow(){
    $("#mask").hide();
    $("#game-over").hide();
}

function again(){
    $("#mask").hide();
    $("#game-over").hide();
    newGame();
}
