using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace SoundSynchro.Web.Security
{
    public static class AuthorizationManager
    {
        public static string GetPassword()
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");
            return configuration.AppSettings.Settings["password"].Value;
        }
        public static void SetPassword(string password)
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");
            configuration.AppSettings.Settings["password"].Value = password;
            configuration.Save();
            if (!string.IsNullOrWhiteSpace(password))
            {
                AuthorizationManager.Lock();
            }
            else
            {
                AuthorizationManager.UnLock();
            }
        }

        public static bool NeedPassword
        {
            get
            {
                return !string.IsNullOrWhiteSpace(GetPassword());
            }
        }
        public static void Lock()
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");
            AuthorizationSection section = (AuthorizationSection)configuration.GetSectionGroup("system.web").Sections.Get("authorization");
            AuthorizationRule denyAnonymous = new AuthorizationRule(AuthorizationRuleAction.Deny);
            denyAnonymous.Users.Add("?");
            section.Rules.Clear();
            section.Rules.Add(denyAnonymous);
            configuration.Save();
        }
        public static void UnLock()
        {
            Configuration configuration = WebConfigurationManager.OpenWebConfiguration("~");
            AuthorizationSection section = (AuthorizationSection)configuration.GetSectionGroup("system.web").Sections.Get("authorization");
            section.Rules.Clear();
            configuration.Save();
        }
    }
}
