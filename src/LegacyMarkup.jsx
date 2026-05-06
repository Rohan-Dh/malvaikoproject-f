function LegacyMarkup({ markup }) {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}

export default LegacyMarkup;
