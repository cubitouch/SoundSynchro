using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace SoundSynchro.Web
{
    public static class APIKeyManager
    {
        private const string _apiKeyKeyFormat = "API_KEY_{0}";

        public static string GetValue(MediaType type)
        {
            string keyName = string.Format(_apiKeyKeyFormat, type);
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");

            if (!configuration.AppSettings.Settings.AllKeys.Contains(keyName))
            {
                configuration.AppSettings.Settings.Add(new KeyValueConfigurationElement(keyName, ""));
            }

            return configuration.AppSettings.Settings[keyName].Value;
        }
        public static void SetValue(MediaType type, string value)
        {
            string keyName = string.Format(_apiKeyKeyFormat, type);
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");

            if (!configuration.AppSettings.Settings.AllKeys.Contains(keyName))
            {
                configuration.AppSettings.Settings.Add(new KeyValueConfigurationElement(keyName, ""));
            }

            configuration.AppSettings.Settings[keyName].Value = value;
            configuration.Save();
        }

    }
}
