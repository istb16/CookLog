var PageModule = function() {
	// private変数
	var commonModule;
	if (!commonModule) commonModule = new CommonModule();

	// publicメソッド

	//
	// 初期化処理
	//
	this.Init = function() {
		$(document).ready(function() {
			// 各コントロールの取得
			var ulList = $('#ulList');

			// 共通データの取得
			commonModule.Refresh();

			// 履歴リストの構築
			if (ulList) {
				for (var key in commonModule.Members) {
					var member = commonModule.Members[key];
					ulList.append($.format('<li><a href="memberEdit?id=%s"><h1>%s</h1></a></li>',
//					ulList.append($.format('<li><a href="memberEdit" onclick="sessionStorage.QueryParams = \'id=%s\';"><p class="ui-li-aside">%s</p><h1>%s</h1><p>%s</p></a></li>',
						encodeURI(key),
						commonModule.Sanitize(member)));
				}
			}

			//
			// スワイプイベント処理
			//
			$('#ulList > li').bind('swipe', function() {
				if (confirm('削除してもよろしいですか')) {
					var href = $(this).find('a').attr('href');
					var queryParams = commonModule.GetQueryParams4Url(href);
					var id = queryParams['id'];
					MemberDelete(id);

					location.reload();
				}

				return false;
			});
		});
	};


	//
	// 提供相手の削除
	//
	var MemberDelete = function(id) {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

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