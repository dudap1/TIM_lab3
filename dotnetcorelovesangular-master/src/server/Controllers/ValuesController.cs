using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Core;
using server.Core.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : Controller
    {
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return Ok(new string[] { "value1", "value2", "value2" });
        }
        
        [Authorize]
        [HttpPost]
        public ActionResult Post([FromBody] DataResource dataResource)
        {
            return Ok(dataResource);
        }

        [Authorize(Policies.RequireAdmin)]
        [HttpDelete("{value}")]
        public ActionResult<string> Delete(string value)
        {
            return Ok($"{value} deleted");
        }
    }
}
