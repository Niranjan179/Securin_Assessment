const mongoose = require("mongoose");

const cveSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cve: {
    id: { type: String, required: true },
    sourceIdentifier: { type: String },
    published: { type: Date },
    lastModified: { type: Date },
    vulnStatus: { type: String },
    descriptions: [
      {
        lang: { type: String },
        value: { type: String },
      },
    ],
    metrics: {
      cvssMetricV2: [
        {
          source: { type: String },
          type: { type: String },
          cvssData: {
            version: { type: String },
            vectorString: { type: String },
            baseScore: { type: Number },
            accessVector: { type: String },
            accessComplexity: { type: String },
            authentication: { type: String },
            confidentialityImpact: { type: String },
            integrityImpact: { type: String },
            availabilityImpact: { type: String },
          },
          baseSeverity: { type: String },
          exploitabilityScore: { type: Number },
          impactScore: { type: Number },
          acInsufInfo: { type: Boolean },
          obtainAllPrivilege: { type: Boolean },
          obtainUserPrivilege: { type: Boolean },
          obtainOtherPrivilege: { type: Boolean },
          userInteractionRequired: { type: Boolean },
        },
      ],
    },
    weaknesses: [
      {
        source: { type: String },
        type: { type: String },
        description: [
          {
            lang: { type: String },
            value: { type: String },
          },
        ],
      },
    ],
    configurations: [
      {
        nodes: [
          {
            operator: { type: String },
            negate: { type: Boolean },
            cpeMatch: [
              {
                vulnerable: { type: Boolean },
                criteria: { type: String },
                matchCriteriaId: { type: String },
              },
            ],
          },
        ],
      },
    ],
    references: [
      {
        url: { type: String },
        source: { type: String },
      },
    ],
  },
});

module.exports = mongoose.model("CVE", cveSchema);

