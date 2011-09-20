var PageModule = function() {

	// private変数
	var commonModule;
	if (!commonModule) commonModule = new CommonModule();

	// publicメソッド

	//
	// 初期化処理
	//
	this.Init = function() {
		//
		// 起動時イベント処理
		//
		$(document).ready(function() {
			// コントロール取得
			var btnCancel = $('#btnCancel');
			var txtName = $('#txtName');

			// 共通データの取得
			commonModule.Refresh();

			// 編集する料理データを取得
			var member = null;
			var queryParams = commonModule.GetQueryParams();
			var id = queryParams['id'];
			if (id) {
				$('#hdnId').val(id);
				member = commonModule.Members[id];
			}

			// 名前の構築
			if (txtName) {
				if (member) txtName.val(member);
			}

			//
			// Submitイベント処理
			//
			$('form').bind('submit', function() {
				if(MemberUpdate()) {
					// 結果表示
					alert('提供相手を保存しました。');

					// 履歴に飛ぶ
					$.mobile.changePage('memberList.php', 'slide', true);
				}

				return false;
			});

			//
			// 削除ボタンクリックイベント処理
			//
			$('#btnDelete').bind('click', function() {
				if (confirm('提供相手を削除してもよろしいですか')) {
					if (MemberDelete()) {
						// 履歴に飛ぶ
						$.mobile.changePage('memberList.php', 'slide', true);
					}
				}
			});
		});
	};

	//
	// 提供相手の追加処理
	//
	var MemberUpdate = function() {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

		// 提供相手IDの取得
		var id = $('#hdnId').val();

		// 入力値の取得
		var name = $('#txtName').val();

		// 項目チェック
		var errorMessage = '';

		if (!id) {
			errorMessage += '・システムエラーが発生しました';
		}

		if (name.length <= 0) {
			errorMessage += '・名前を入力してください\n';
		}

		// 保存処理
		var isSuccess = false;
		if (errorMessage.length <= 0) {
			commonModule.Members[id] = name;

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

	//
	// 提供相手の削除
	//
	var MemberDelete = function() {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

		// 料理IDの取得
		var id = $('#hdnId').val();

		// 項目チェック
		var errorMessage = '';

		if (!id) {
			errorMessage += '・システムエラーが発生しました';
		}

		// 保存処理
		var isSuccess = false;
		if (errorMessage.length <= 0) {
			// リストから削除
			delete commonModule.Members[id];

			// 保存
			commonModule.Save();

			isSuccess = true;
		}
		else {
			alert(errorMessage);
		}

		$.mobile.pageLoading(true);

		return isSuccess;
	}
}

var pageModule = new PageModule();
pageModule.Init();