/* CodeFluent Generated . TargetVersion:Sql2008, Sql2012, Sql2014, SqlAzure. Culture:en-US. UiCulture:en-US. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
ALTER TABLE [dbo].[Playlist_musics_Music] WITH NOCHECK ADD CONSTRAINT [FK_Ply_Pla_Pla_Pla] FOREIGN KEY (
 [Playlist_id]
) REFERENCES [dbo].[Playlist](

 [Playlist_id]
)
ALTER TABLE [dbo].[Playlist_musics_Music] NOCHECK CONSTRAINT [FK_Ply_Pla_Pla_Pla]
ALTER TABLE [dbo].[Playlist_musics_Music] WITH NOCHECK ADD CONSTRAINT [FK_Ply_Mus_Mus_Mus] FOREIGN KEY (
 [Music_id]
) REFERENCES [dbo].[Music](

 [Music_id]
)
ALTER TABLE [dbo].[Playlist_musics_Music] NOCHECK CONSTRAINT [FK_Ply_Mus_Mus_Mus]
