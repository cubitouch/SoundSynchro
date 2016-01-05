using SoundSynchro.Web;
using SoundSynchro.Web.Security;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace SoundSynchro.Server.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(MusicCollection.LoadAll());
        }

        public ActionResult MusicList()
        {
            return PartialView("MusicList", MusicCollection.LoadAll());
        }
        public ActionResult PlaylistList()
        {
            return PartialView("PlaylistList", PlaylistCollection.LoadAll());
        }
        public string PlaylistContent(Guid id)
        {
            MusicCollection musics = MusicCollection.LoadmusicsByPlaylist(Playlist.LoadByid(id));
            StringBuilder result = new StringBuilder();

            result.Append("[");
            foreach (Music music in musics)
            {
                result.Append("{");
                result.Append(" \"id\":\"" + music.id + "\",");
                result.Append(" \"title\":\"" + music.title + "\",");
                result.Append(" \"audio\":\"" + music.AudioUrl + "\",");
                result.Append(" \"thumbnail\":\"" + music.ThumbnailUrl + "\",");
                result.Append(" \"type\":\"" + music.type + "\"");
                result.Append("}" + (music == musics.Last() ? "" : ","));
            }
            result.Append("]");

            return result.ToString();
        }
        public ActionResult PlaylistUpdate(Guid id, string title, MusicCollection musics)
        {
            Playlist playlist = Playlist.LoadByid(id);

            if (musics == null)
            {
                playlist.Delete();
                playlist = null;
            }
            else if (musics.Count() == 0)
            {
                playlist.Delete();
                playlist = null;
            }
            else
            {
                playlist.title = title;
                playlist.musics.Clear();
                playlist.musics.AddRange(musics);
                playlist.Save();
                playlist.musics.Clear();
                playlist.musics.AddRange(MusicCollection.LoadmusicsByPlaylist(playlist));
            }

            return PartialView("PlaylistItem", playlist);
        }

        public ActionResult MusicSearch(string search)
        {
            return PartialView("MusicList", MusicCollection.SearchAll(search));
        }

        public bool MusicUpdate(Guid id, string title)
        {
            Music music = Music.LoadByid(id);
            music.title = title;
            return music.Save();
        }
        public bool MusicDelete(Guid id)
        {
            Music music = Music.LoadByid(id);
            return music.Delete();
        }

        public bool PlaylistCreate(string title, MusicCollection musics)
        {
            Playlist playlist = new Playlist();
            playlist.title = title;
            playlist.date = DateTime.Now;
            playlist.musics.AddRange(musics);
            playlist.Save();

            return true;
        }

        public ActionResult StorageManagement()
        {
            return PartialView("Storage");
        }

        [HttpPost]
        public ActionResult Storage(HttpPostedFileBase audio, HttpPostedFileBase thumbnail)
        {
            if (audio != null && audio.ContentLength > 0)
            {
                Music.SaveUpload(audio, thumbnail);
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public ActionResult StorageMultiple(IEnumerable<HttpPostedFileBase> files)
        {
            List<string> names = new List<string>();
            foreach (HttpPostedFileBase file in files)
            {
                string title = Path.GetFileNameWithoutExtension(file.FileName);
                if (!names.Contains(title))
                {
                    names.Add(title);
                }
            }

            foreach (string name in names)
            {
                HttpPostedFileBase audio = null;
                HttpPostedFileBase thumbnail = null;

                foreach (HttpPostedFileBase file in files)
                {
                    if (name == Path.GetFileNameWithoutExtension(file.FileName))
                    {
                        if (Path.GetExtension(file.FileName) == ".mp3")
                        {
                            audio = file;
                        }
                        else
                        {
                            thumbnail = file;
                        }
                    }
                }

                if (audio != null && audio.ContentLength > 0)
                {
                    Music.SaveUpload(audio, thumbnail);
                }
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult StorageYoutube(string link, string title)
        {
            //https://www.youtube.com/watch?v=LG3fD7ONSJY&list=RDM5uIVBxWZVU&index=2
            string id = link.Split('?')[1].Split('&').First(p => p.StartsWith("v=")).Replace("v=", "");

            Music music = new Music();
            music.file = id;
            music.thumbnail = string.Format("https://i.ytimg.com/vi/{0}/default.jpg", id);
            music.title = title;
            music.type = MediaType.Youtube;
            music.Save();

            return RedirectToAction("Index");
        }
        [HttpPost]
        public ActionResult StorageSoundCloud(string link, string title)
        {
            //https://soundcloud.com/hd_09/trumpets-jason-derulo
            //string id = link.Split('?')[1].Split('&').First(p => p.StartsWith("v=")).Replace("v=", "");

            Music music = new Music();
            music.file = link;
            //music.thumbnail = string.Format("https://i.ytimg.com/vi/{0}/default.jpg", id);
            music.title = title;
            music.type = MediaType.SoundCloud;
            music.Save();

            return RedirectToAction("Index");
        }


        public ActionResult SettingsManagement()
        {
            return PartialView("Settings");
        }
        [HttpPost]
        public ActionResult SettingsManagementUpdate(string password)
        {
            AuthorizationManager.SetPassword(password.Trim());
            return RedirectToAction("Index");
        }


        //public string DeezerChannel()
        //{
        //    return "<script src=\"http://e-cdn-files.deezer.com/js/min/dz.js\"></script>";
        //}

        public string RadioContent()
        {
            MusicCollection musics = RadioManager.Current.musics;
            StringBuilder result = new StringBuilder();

            result.Append("{");
            result.Append("\"currentTime\":\"" + RadioManager.Current.CurrentTime + "\",");
            result.Append("\"currentMusicId\":\"" + RadioManager.Current.CurrentMusicId + "\",");
            result.Append("\"content\": [");
            foreach (Music music in musics)
            {
                result.Append("{");
                result.Append(" \"id\":\"" + music.id + "\",");
                result.Append(" \"title\":\"" + music.title + "\",");
                result.Append(" \"audio\":\"" + music.AudioUrl + "\",");
                result.Append(" \"thumbnail\":\"" + music.ThumbnailUrl + "\",");
                result.Append(" \"type\":\"" + music.type + "\"");
                result.Append("}" + (music == musics.Last() ? "" : ","));
            }
            result.Append("]");
            result.Append("}");

            return result.ToString();
        }
        public bool RadioContentAdd(Guid id, bool? forcePlay)
        {
            Music music = Music.Load(id);
            if (music == null)
            {
                return false;
            }
            if (!RadioManager.Current.musics.Contains(music))
            {
                RadioManager.Current.musics.Add(music);
            }
            if (forcePlay.GetValueOrDefault())
            {
                RadioManager.Current.CurrentMusicId = id.ToString();
            }
            return true;
        }
        public bool RadioContentPlay(Guid id)
        {
            RadioManager.Current.CurrentMusicId = id.ToString();
            return true;
        }
        public bool RadioContentSeek(double time)
        {
            RadioManager.Current.CurrentTime = time;
            return true;
        }
    }
}