using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SoundSynchro
{
    public partial class Playlist
    {
        private string _currentMusicId;
        public string CurrentMusicId
        {
            get
            {
                return _currentMusicId;
            }
            set
            {
                MusicCollection musicsToPurge = new MusicCollection();
                foreach (Music music in musics)
                {
                    if (music.id.ToString() == value)
                    {
                        break;
                    }
                    musicsToPurge.Add(music);
                }
                foreach (Music musicToPurge in musicsToPurge)
                {
                    musics.Remove(musicToPurge);
                }
                _currentMusicId = value;
            }
        }
        public double CurrentTime { get; set; }

        private Dictionary<string, DateTime> _activeClients;
        public Dictionary<string, DateTime> ActiveClients
        {
            get
            {
                if (_activeClients == null)
                {
                    _activeClients = new Dictionary<string, DateTime>();
                }
                return _activeClients;
            }
        }
        public void SetActiveClient(string clientId, DateTime date)
        {
            if (!ActiveClients.Keys.Contains(clientId))
            {
                ActiveClients.Add(clientId, date);
            }
            else
            {
                ActiveClients[clientId] = date;
            }
            IEnumerable<string> clientToPurge = ActiveClients.Where(c => c.Value < DateTime.Now.AddSeconds(-10)).Select(c => c.Key).ToList();
            foreach (string client in clientToPurge)
            {
                ActiveClients.Remove(client);
            }
        }
        public int ActiveClientsNumber
        {
            get
            {
                return ActiveClients.Count;
            }
        }
    }
}
