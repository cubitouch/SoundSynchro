using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace SoundSynchro.Web
{
    public static class VorlonJSManager
    {
        public static string GetServer()
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");

            if (!configuration.AppSettings.Settings.AllKeys.Contains("vorlonjs-server"))
            {
                configuration.AppSettings.Settings.Add(new KeyValueConfigurationElement("vorlonjs-server", ""));
            }

            return configuration.AppSettings.Settings["vorlonjs-server"].Value;
        }
        public static void SetServer(string server)
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");

            if (!configuration.AppSettings.Settings.AllKeys.Contains("vorlonjs-server"))
            {
                configuration.AppSettings.Settings.Add(new KeyValueConfigurationElement("vorlonjs-server", ""));
            }

            configuration.AppSettings.Settings["vorlonjs-server"].Value = server;
            configuration.Save();

        }

        public static bool GetServerConfigured()
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");

            if (!configuration.AppSettings.Settings.AllKeys.Contains("vorlonjs-active"))
            {
                configuration.AppSettings.Settings.Add(new KeyValueConfigurationElement("vorlonjs-active", "False"));
            }

            return bool.Parse(configuration.AppSettings.Settings["vorlonjs-active"].Value);
        }
        public static void SetServerConfigured(bool serverConfigured)
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");

            if (!configuration.AppSettings.Settings.AllKeys.Contains("vorlonjs-active"))
            {
                configuration.AppSettings.Settings.Add(new KeyValueConfigurationElement("vorlonjs-active", ""));
            }

            configuration.AppSettings.Settings["vorlonjs-active"].Value = serverConfigured.ToString();
            configuration.Save();

        }
    }
}
