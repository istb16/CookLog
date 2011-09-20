var PageModule = function() {
	var commonModule;
	if (!commonModule) commonModule = new CommonModule();

	// publicメソッド

	//
	// 初期化処理
	//
	this.Init = function() {
		$(document).ready(function() {
			//
			// Submitイベント処理
			//
			$('form').bind('submit', function(){
				if (MemberAdd()) {
					// 結果表示
					alert('提供相手を追加しました。');

					// 終了
					$('#btnBack').click();
				}

				return false;
			});
		});
	};

	//
	// 提供相手の追加処理
	//
	var MemberAdd = function() {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

		// 入力値の取得
		var name = $('#txtName').val();

		// 項目チェック
		var errorMessage = '';

		if (name.length <= 0) {
			errorMessage += '・名前を入力してください\n';
		}

		// 保存処理
		var isSuccess = false;
		if (errorMessage.length <= 0) {
			// 新規キーを取得
			var maxKey = -1;
			for (var key in commonModule.Members) {
				if (key > maxKey) maxKey = key;
			}
			maxKey++;
			commonModule.Members[maxKey] = name;

			// 保存
			commonModule.Save();

			isSuccess = true;
		}
		else {
			alert(errorMessage);
		}

		$.mobile.pageLoading(true);

		return isSuccess;
	};
}

var pageModule = new PageModule();
pageModule.Init();