using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApplication1.Models;
using System.IO;
using System.Collections.Generic;
using System;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Text;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetIcons()
        {
            string fromFile = System.IO.File.ReadAllText("DB\\icons.txt");
            return Ok(fromFile);
        }

        [HttpPost]
        public async Task<IActionResult> addIcon(string name, string tags, string type, IFormFile file)
        {
            string uniqFileName = (string.IsNullOrEmpty(name)) ? file.FileName : name;
            string uploadTo = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\icons", uniqFileName);

            using (var fileSteam = new FileStream(uploadTo, FileMode.Create))
            {
                await file.CopyToAsync(fileSteam);
            }

            IconModel newIcon = new IconModel()
            {
                id = Guid.NewGuid().ToString(),
                name = name,
                tags = string.IsNullOrEmpty(tags) ? new List<string>() : tags.Split(",").ToList(),
                type = type,
                date = DateTime.Now
            };
            string fromTxt = System.IO.File.ReadAllText("DB\\icons.txt");

            if (string.IsNullOrEmpty(fromTxt))
            {
                List<IconModel> singleList = new List<IconModel>();
                singleList.Add(newIcon);
                var serializedIcon = JsonConvert.SerializeObject(singleList);
                System.IO.File.WriteAllText("DB\\icons.txt", serializedIcon);
            }
            else
            {
                List<IconModel> iconList = JsonConvert.DeserializeObject<List<IconModel>>(fromTxt);
                iconList.Add(newIcon);
                var serializedList = JsonConvert.SerializeObject(iconList);
                System.IO.File.WriteAllText("DB\\icons.txt", string.Empty);
                System.IO.File.WriteAllText("DB\\icons.txt", serializedList);
            }

            string fromFile = System.IO.File.ReadAllText("DB\\icons.txt");
            return Ok(fromFile);
        }

        [HttpPost]
        public IActionResult EditIcon(string name, string tags, string type, string id)
        {
            string fromTxt = System.IO.File.ReadAllText("DB\\icons.txt");
            List<IconModel> iconList = JsonConvert.DeserializeObject<List<IconModel>>(fromTxt);

            int iconIndex = iconList.FindIndex(i => i.id == id);
            iconList[iconIndex].name = name;
            iconList[iconIndex].tags = string.IsNullOrEmpty(tags) ? new List<string>() : tags.Split(",").ToList();
            iconList[iconIndex].type = type;
            var serializedList = JsonConvert.SerializeObject(iconList);
            System.IO.File.WriteAllText("DB\\icons.txt", string.Empty);
            System.IO.File.WriteAllText("DB\\icons.txt", serializedList);
            string fromFile = System.IO.File.ReadAllText("DB\\icons.txt");
            return Ok(fromFile);
        }

        public IActionResult DeleteIcon(string id)
        {
            string fromTxt = System.IO.File.ReadAllText("DB\\icons.txt");
            List<IconModel> iconList = JsonConvert.DeserializeObject<List<IconModel>>(fromTxt);
            IconModel iconToRemove = iconList.FirstOrDefault(i => i.id == id);
            iconList.Remove(iconToRemove);
            var serializedList = JsonConvert.SerializeObject(iconList);
            System.IO.File.WriteAllText("DB\\icons.txt", string.Empty);
            System.IO.File.WriteAllText("DB\\icons.txt", serializedList);

            // remove file from folder
            if (System.IO.File.Exists(Path.Combine("wwwroot\\icons", iconToRemove.name)))
            {
                System.IO.File.Delete(Path.Combine("wwwroot\\icons", iconToRemove.name));
            }

            string fromFile = System.IO.File.ReadAllText("DB\\icons.txt");
            return Ok(fromFile);
        }



        [HttpPost]
        public IActionResult Login(string username, string pass)
        {
            string fromTxt = System.IO.File.ReadAllText("DB\\user.txt");
            User user = JsonConvert.DeserializeObject<User>(fromTxt);

            if (username == user.Username && pass == user.Password)
            {
                return Ok(user.Token);
            }
            else
            {
                return BadRequest("incorrect info");
            }
        }

        [HttpPost]
        public IActionResult CheckToken(string token)
        {
            string fromTxt = System.IO.File.ReadAllText("DB\\user.txt");
            User user = JsonConvert.DeserializeObject<User>(fromTxt);

            if (token == user.Token)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Please don`t try to hack this website: Başın ağrıyar !");
            }
        }
    }
}
