using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using QuizAPI.Models;

namespace QuizAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly IMongoCollection<Participant> _participantCollection;

        public ParticipantsController()
        {
            // Connect to your MongoDB database
            MongoClient mongoClient = new MongoClient("mongodb+srv://Kai:kai@cluster0.ldthz5h.mongodb.net/?retryWrites=true&w=majority");
            IMongoDatabase database = mongoClient.GetDatabase("QuizDB");

            // Get the "Questions" collection
            _participantCollection = database.GetCollection<Participant>("Participants");
        }

        // GET: api/Participants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetParticipants()
        {

            var participants = await _participantCollection.Find(FilterDefinition<Participant>.Empty).ToListAsync();

            // Convert ObjectId to string
            var participantsWithIdAsString = participants.Select(p => new
            {
                participantId = p.Id.ToString(),  // Convert ObjectId to string
                p.Email,
                p.Name,
                p.Score,
                p.TimeTaken
            }).ToList();

            return Ok(participantsWithIdAsString);
        }

        // GET: api/Participants/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetParticipant(string id)
        {
            // Convert the string id to ObjectId
            ObjectId objectId;
            if (!ObjectId.TryParse(id, out objectId))
            {
                return BadRequest("Invalid ObjectId format.");
            }

            // Find the participant by ObjectId
            var participant = await _participantCollection.Find(x => x.Id == objectId).FirstOrDefaultAsync();

            if (participant == null)
            {
                return NotFound();
            }

            return Ok(participant);
        }

        // POST: api/Participants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Participant>> PostParticipant(Participant participant)
        {
            var temp = _participantCollection.AsQueryable()
                .Where(x => x.Name == participant.Name
                && x.Email == participant.Email)
                .FirstOrDefault();

            if (temp == null)
            {
                await _participantCollection.InsertOneAsync(participant);
            }
            else
            {
                participant = temp;
            }

            // Convert ObjectId to string before returning
            var participantWithIdAsString = new
            {
                participantId = participant.Id.ToString(),
                participant.Email,
                participant.Name,
                participant.Score,
                participant.TimeTaken
            };

            return Ok(participantWithIdAsString);
        }

        // PUT: api/Participants/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<Participant>> PutParticipant(string id, Participant updatedParticipant)
        {
            // Parse the id string to ObjectId
            ObjectId objectId;
            if (!ObjectId.TryParse(id, out objectId))
            {
                // Handle invalid ObjectId format
                return BadRequest("Invalid ObjectId format");
            }

            // Create a filter to find the document by _id
            var filter = Builders<Participant>.Filter.Eq("_id", objectId);

            // Create an update definition to set the new values for Score and TimeTaken
            var update = Builders<Participant>.Update
                .Set("Score", updatedParticipant.Score)
                .Set("TimeTaken", updatedParticipant.TimeTaken);

            Participant original = await _participantCollection.Find(filter).FirstOrDefaultAsync();

            // Use Find to retrieve the document
            var result = await _participantCollection.UpdateOneAsync(filter, update);

            // Retrieve the updated participant document
            Participant participant = await _participantCollection.Find(filter).FirstOrDefaultAsync();

            return Ok(participant);
        }
    }
}
