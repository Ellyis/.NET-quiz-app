using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using QuizAPI.Models;

namespace QuizAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IMongoCollection<Question> _questionCollection;

        public QuestionsController()
        {
            // Connect to your MongoDB database
            MongoClient mongoClient = new MongoClient("mongodb+srv://Kai:kai@cluster0.ldthz5h.mongodb.net/?retryWrites=true&w=majority");
            IMongoDatabase database = mongoClient.GetDatabase("QuizDB");

            // Get the "Questions" collection
            _questionCollection = database.GetCollection<Question>("Questions");
        }

        // GET: api/Questions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            var random5Questions = await _questionCollection.AsQueryable()
                .Sample(5)
                .Select(x => new
                {
                    QuestionId = x.Id.ToString(),
                    x.QuestionInWords,
                    x.ImageName,
                    Options = new string[]
                    {
                        x.Option1, x.Option2, x.Option3, x.Option4
                    }
                })
                .ToListAsync();

            return Ok(random5Questions);
        }

        // POST: api/Questions/GetAnswers
        [HttpPost]
        [Route("GetAnswers")]
        public async Task<ActionResult<IEnumerable<Question>>> GetAnswers(string[] questionIds)
        {
            // Parse the string array to ObjectId array
            var objectIdList = questionIds.Select(ObjectId.Parse).ToList();

            var filter = Builders<Question>.Filter.In(x => x.Id, objectIdList);
            var answers = await _questionCollection
                .Find(filter)
                .ToListAsync();

            var answersWithIdAsString = answers.Select(x => new
            {
                QuestionId = x.Id.ToString(),
                x.QuestionInWords,
                x.ImageName,
                Options = new string[]
                    {
                        x.Option1, x.Option2, x.Option3, x.Option4
                    },
                x.Answer
            }).ToList();

            return Ok(answersWithIdAsString);
        }

        //// GET: api/Questions/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Question>> GetQuestion(int id)
        //{
        //    if (_context.Questions == null)
        //    {
        //        return NotFound();
        //    }
        //    var question = await _context.Questions.FindAsync(id);

        //    if (question == null)
        //    {
        //        return NotFound();
        //    }

        //    return question;
        //}

        //// PUT: api/Questions/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutQuestion(int id, Question question)
        //{
        //    if (id != question.QuestionId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(question).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!QuestionExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/Questions
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Question>> PostQuestion(Question question)
        //{
        //    if (_context.Questions == null)
        //    {
        //        return Problem("Entity set 'QuizDbContext.Questions'  is null.");
        //    }

        //    _context.Questions.Add(question);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetQuestion", new { id = question.QuestionId }, question);
        //}

        //// DELETE: api/Questions/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteQuestion(int id)
        //{
        //    if (_context.Questions == null)
        //    {
        //        return NotFound();
        //    }
        //    var question = await _context.Questions.FindAsync(id);
        //    if (question == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Questions.Remove(question);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool QuestionExists(int id)
        //{
        //    return (_context.Questions?.Any(e => e.QuestionId == id)).GetValueOrDefault();
        //}
    }
}
