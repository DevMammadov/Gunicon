using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class IconModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public List<string> tags { get; set; }
        public DateTime date { get; set; }
    }
}
