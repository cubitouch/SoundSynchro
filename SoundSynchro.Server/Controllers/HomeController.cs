﻿using CodeFluent.Runtime.BinaryServices;
using Newtonsoft.Json;
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
                result.Append(" \"thumbnail\":\"" + music.ThumbnailUrl + "\"");
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
    }
}