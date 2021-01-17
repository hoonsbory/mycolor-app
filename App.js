import React from 'react';
import { WebView } from 'react-native-webview'
import { ToastAndroid, BackHandler } from 'react-native';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  webView = {
    canGoBack: false,
    canGoForward: false,
    ref: null,
  }




  componentDidMount() {
    this.getPermissionsAsync()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  // 이벤트 해제 
  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    alert(status)
    if(status==="denied"){
      alert("카메라 권한을 거부하셨습니다. \n 피부 스캔 방식이 아닌 저장된 사진을 통해 측정합니다. \n 권한을 다시 설정하시려면 앱을 완전히 종료 후 다시 실행해주세요.")
    }
};

  // 이벤트 동작
  handleBackButton = () => {
    // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    else if (this.exitApp == undefined || !this.exitApp) {
      ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
      this.exitApp = true;

      this.timeout = setTimeout(
        () => {
          this.exitApp = false;
        },
        2000    // 2초
      );
    } else {
      clearTimeout(this.timeout);

      BackHandler.exitApp();  // 앱 종료
    }
    return true;
  }

  render() {

    return (
      <WebView
        source={{ uri: "https://mycolor.kr" }}
        textZoom={100}
        ref={(webView) => { this.webView.ref = webView; }}
        onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
      />

    );
  }
}


