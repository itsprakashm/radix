package com.qdialer;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.goodatlas.audiorecord.RNAudioRecordPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import io.rumors.reactnativesettings.RNSettingsPackage;
import eu.sigrlami.rnsimdata.RNSimDataReactPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.ssg.autostart.AutostartPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.github.wumke.RNImmediatePhoneCall.RNImmediatePhoneCallPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.wscodelabs.callLogs.CallLogPackage;
import com.pritesh.calldetection.CallDetectionManager;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAudioRecordPackage(),
            new SplashScreenReactPackage(),
            new RNCardViewPackage(),
            new RNSettingsPackage(),
            new RNSimDataReactPackage(),
            new ReactNativeContacts(),
            new AutostartPackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new SQLitePluginPackage(),
            new RNSoundPackage(),
            new InCallManagerPackage(),
            new RNImmediatePhoneCallPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new CallLogPackage(),
            new CallDetectionManager(MainApplication.this),
            new ReactNativeAudioPackage(),

            new NetInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    
  }
}
