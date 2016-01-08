using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SoundSynchro
{
    public partial class Music
    {
        public string AudioUri
        {
            get
            {
                switch (this.type)
                {
                    case MediaType.File:
                        return string.Format("{0}/{1}/{2}", HttpContext.Current.Server.MapPath("~/uploads"), id, file);
                    default:
                        return file;
                }
                return "";
            }
        }
        public string ThumbnailUri
        {
            get
            {
                switch (this.type)
                {
                    case MediaType.File:
                        return string.Format("{0}/{1}/{2}", HttpContext.Current.Server.MapPath("~/uploads"), id, thumbnail);
                    default:
                        return thumbnail;
                }
                return "";
            }
        }

        public string AudioUrl
        {
            get
            {
                switch (this.type)
                {
                    case MediaType.File:
                        return string.Format("{0}/{1}/{2}", VirtualPathUtility.ToAbsolute("~/uploads"), id, file);
                    default:
                        return file;
                }
                return "";
            }
        }
        public string ThumbnailUrl
        {
            get
            {
                switch (this.type)
                {
                    case MediaType.File:
                        return string.Format("{0}/{1}/{2}", VirtualPathUtility.ToAbsolute("~/uploads"), id, thumbnail);
                    default:
                        return thumbnail;
                }
                return "";
            }
        }

        public static void SaveUpload(HttpPostedFileBase audio, HttpPostedFileBase thumbnail)
        {
            Music music = new Music();
            music.date = DateTime.Now;
            music.title = Path.GetFileNameWithoutExtension(audio.FileName);
            music.file = audio.FileName;
            if (thumbnail != null)
            {
                music.thumbnail = thumbnail.FileName;
            }
            music.Save();

            if (!Directory.Exists(Path.GetDirectoryName(music.AudioUri)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(music.AudioUri));
            }
            audio.SaveAs(music.AudioUri);

            if (thumbnail != null)
            {
                if (!Directory.Exists(Path.GetDirectoryName(music.ThumbnailUri)))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(music.ThumbnailUri));
                }
                thumbnail.SaveAs(music.ThumbnailUri);
            }
        }
    }
}
