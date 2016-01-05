
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundSynchro.Web
{
    public static class RadioManager
    {
        private static Playlist _current;
        public static Playlist Current
        {
            get
            {
                if (_current == null)
                {
                    _current = new Playlist();
                }
                return _current;
            }
        }
    }
}
