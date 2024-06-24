const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('herkeserol-ver')
        .setDescription('Herkese Rol Verirsin!')
        .addRoleOption(option =>
            option
                .setName('rol')
                .setDescription('Lütfen bir rol etiketle!')
                .setRequired(true)
        ),
    run: async (client, interaction) => {
        const rol = interaction.options.getRole('rol');

        const noPermissionEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(':x: | Rolleri Yönet Yetkin Yok!');
        const successEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: | Başarıyla herkese ${rol} rolü verildi.`);
        const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(':x: | Kullanıcılara rol verilemedi. Botun yetkisi yetersiz veya bir hata oluştu.');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        try {
            const members = await interaction.guild.members.fetch();
            members.forEach(async member => {
                if (!member.roles.cache.has(rol.id)) {
                    await member.roles.add(rol);
                }
            });

            interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Error giving roles to members:', error);
            interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};
