$(function () {

    var uploadedImage;

    // 画像を画面に表示
    var showImage = function () {
        if (uploadedImage) {
            var blobUrl = window.URL.createObjectURL(uploadedImage);
            $("#ImageToAnalyze").attr("src", blobUrl);
        }
    };

    //画像の分析    
    var getFaceInfo = function () {

        // Custom Vision の Subscription Key と URL をセット
        // サブスクリプション画面に表示される URL および Key をコピーしてください
        var predictionKey = "1ced303d01c449e7b8ec5d25f84904ab";
        var endpoint = "https://damcurry.cognitiveservices.azure.com/customvision/v3.0/Prediction/8501788c-1ead-4c9c-b8cf-9a4eb71c0057/classify/iterations/Iteration6/image";
        
        // Custom Vision 呼び出し URL をセット
        var webSvcUrl = endpoint;       

        // 画面に表示するメッセージをセット
        var outputDiv = $("#OutputDiv");
        if(document.getElementById('imageFile').value == "")
        {
            // 初期設定
            outputDiv.text("画像を選択してください");
        }
        else{
            // 判別
            outputDiv.text("形式判別中...");
        }
    
        //  API を呼び出すためのパラメーターをセットして呼び出し
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", webSvcUrl, true);
        xmlHttp.setRequestHeader("Prediction-Key", predictionKey);
        xmlHttp.setRequestHeader("Content-Type", "application/octet-stream");
        xmlHttp.send(uploadedImage);
        xmlHttp.onreadystatechange = function () {

            // データが取得出来た場合
            if (this.readyState == 4 && this.status == 200) {

                let data = JSON.parse(this.responseText)

                // 判別結果を取得
                var predictions = data.predictions;

                var probability = [];
                var tagName = [];
                for ( var i = 0; i < predictions.length; i++ )
                {
                    probability[i] = predictions[i].probability;
                    tagName[i] = predictions[i].tagName;    
                }

                //小数点6位までを残す関数 (判別スコアの丸めに利用)
                function floatFormat( number ) {
                    return Math.round( number * Math.pow( 10 , 6 ) ) / Math.pow( 10 , 6 ) ;
                }

                function floatFormat2( number ) {
                    return Math.round( number *100)/100 ;
                }


                var outputText =  "このダムカレーの形式は、<br>";
                //outputText +=  tagName[0] + "です！<br>" + "信頼度は、 "+ floatFormat(probability[0])*100+ "%";
                outputText +=  tagName[0] + " "+ floatFormat2(probability[0])*100+ "%<br>";
                outputText +=  tagName[1] + " "+ floatFormat2(probability[1])*100+ "%<br>です！";
           //     outputText +=  tagName[2] + " "+ floatFormat2(probability[2])*100+ "%<br>";


                outputDiv.html(outputText);

            }
            else
            // データが取得できなかった場合
            {
                outputDiv.text("ERROR!");
            };
        };
    };

    // 画像が変更された場合（再度分析＆表示)
    $("#imageFile").on('change', function(e){
        uploadedImage = e.target.files[0];
        showImage();
        getFaceInfo();
    });

});
